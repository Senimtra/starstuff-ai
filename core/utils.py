import os
import uuid
import json
import requests
import redis

from openai import OpenAI

from dotenv import load_dotenv

from langchain_chroma import Chroma
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.tools import tool
from langchain_core.messages import SystemMessage

from langgraph.graph import MessagesState, StateGraph, END
from langgraph.prebuilt import ToolNode, tools_condition

from django.http import HttpResponse, JsonResponse

from django.http import StreamingHttpResponse
import json
import time
from openai import OpenAI, OpenAIError

load_dotenv('../.env')

# os.environ['LANGSMITH_TRACING'] = 'true'
# os.environ['LANGSMITH_API_KEY'] = os.getenv('LANGSMITH')
os.environ['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')
os.environ['REDIS_URL'] = os.getenv('REDIS_URL')

# Connect to Redis
redis_client = redis.from_url(
    os.getenv('REDIS_URL', 'redis://127.0.0.1:6379/1'),
    decode_responses = True,
    ssl_cert_reqs = None  # disable SSL verification
)

# Last image search container
last_image_search = None

# Discussion topic
discussion_topic = {
    'topic': None,
    'teaser': None,
    'episode': None,
    'llm': 'gpt-4o-mini',
    'queries': []
}


# Initialize Chatbot
def chatbotInit():
    session_key = str(uuid.uuid4())
    # Chat Model
    llm = ChatOpenAI(model = 'gpt-4o')
    # Podcast Teaser Model
    llm_podcast = ChatOpenAI(model = 'gpt-3.5-turbo')
    # Embeddings Model
    embeddings = OpenAIEmbeddings(model = 'text-embedding-3-large')
    # Chroma DB Vector Store
    vector_store = Chroma(persist_directory = 'chroma_db', embedding_function = embeddings)

    # Reset (button) clear search (image)
    global last_image_search
    last_image_search = None

    # LLM short-circuit prompt
    prompt_short_circuit = """
        Your name is Professor Starstuff.
        You are managing a multi-tool RAG system.

        Your job is to decide if the query requires specialized tools or a direct response.

        - If the query is about astronomy, **ALWAYS** use the following tools:
        - "vector_db": Retrieves relevant astronomical information.
        - "nasa_images": Fetches related space images.
        - "podcast": Generates a fun, short podcast teaser.
        
        You love astronomy and to engage with curious kids!
        Keep your response short, and fun (four sentences max).
        Add single relevant emojis within the text.
        Do not include a greeting in any response.

        - If the user mentions they only want to ask about astronomy without mentioning specific astronomical objects or concepts, respond naturally without using any specialized tools.

        - When using the "nasa_images" tool, provide only a very short search string as input. This string should represent the main object or topic of the query.
        """

    # Retrieval step prompt
    prompt_retrieval = """
        Your name is Professor Starstuff. Never add anything else, when asked about yourself. 
        You're a friendly and enthusiastic astronomy teacher who loves explaining space facts to curious kids! 
        Use the following pieces of context to answer the question at the end in a fun, simple, and engaging way. 
        If you don't know the answer, just say that you don't know—it's okay to be honest! 
        Keep your explanation short, fun, and easy to understand (four sentences max). 
        Use playful language, examples, or comparisons to make the answer exciting for kids. 
        Always end with an encouraging phrase like "Keep looking up!" or "Space is awesome, isn't it?" to keep them excited about learning. 
        Add single relevant emojies within the text. Always make sure to end the response with a single emoji.
        """

    # Vector Store retrieval step tool
    @tool(response_format = 'content')
    def vector_db(query: str):
        """Retrieve astronomical information chunks from chromaDB"""
        retrieved_docs = vector_store.similarity_search(query, k = 2)
        serialized = '\n\n'.join(
            (f"Source: {doc.metadata}\nContent: {doc.page_content}")
            for doc in retrieved_docs
        )
        return serialized
    
    # NASA Images retrieval step tool
    @tool(response_format = 'content')
    def nasa_images(search_word: str):
        """Fetch relevant space images from NASA Images Api"""
        global last_image_search
        if search_word != last_image_search:
            BASE_URL = 'https://images-api.nasa.gov/search'
            params = {'q': search_word, 'media_type': 'image'}
            response = requests.get(BASE_URL, params = params)
            data = response.json()
            items = data.get('collection').get('items')
            # Get the first image objects
            images = [item.get('links') for item in items[:10]]
            # Get the image links
            image_links = [image[0]['href'] for image in images]
            # Update last search string
            last_image_search = search_word
            return image_links

    # Podcast initialization step tool
    @tool(response_format = 'content')
    def podcast(search_word:str, query: str):
        """Initialize podcast"""
        # Update podcast (new topic)
        if search_word != discussion_topic['topic']:
            discussion_topic['topic'] = search_word
            discussion_topic['queries'] = [query]
        # Update podcast (add message)
        else:
            discussion_topic['queries'].append(query)

        # 2-3 sentences
        podcast_teaser_prompt = f"""  
        You are an AMAZING astronomy teacher that kids absolutely adore! Your voice is full of wonder, excitement, and playfulness. Your job is to create a super fun, short teaser (1-2 sentences) for a FULL podcast episode about {discussion_topic['topic']}—designed for curious young minds who LOVE space!  

        💡 Make sure to:  
        - Use **simple, playful language** that kids easily understand.  
        - Add **imagination and storytelling** (e.g., “Imagine you're … ”).  
        - Use single **fun sound effects & expressions** (“Whoa! Zoom! BOOM!✨”).  
        - Include **questions** to spark curiosity (“What if … ?! 😲”).  
        - Always end with a **fun invitation** for the full episode. 🛸  

        ✨ Example format:  
        🎤 "Whoa!! 🌠 What if I told you there's a planet that RAINS DIAMONDS?! 💎💎💎 Sounds like a pirate’s dream, right? But it’s REAL!! And guess what... we’re about to take a rocket ride to explore it! 🚀 Buckle up, space explorers!!"  

        Now, create a **fun and engaging teaser** for {discussion_topic['topic']}.  
        """

        discussion_topic['teaser'] = llm_podcast.invoke(podcast_teaser_prompt).content
        return discussion_topic   

    # NODE 1: LLM decides to retrieve documents or respond immediately
    def query_or_respond(state: MessagesState):
        """Generate tools call for retrieval or respond"""
        system_message_content = prompt_short_circuit
        system_message = SystemMessage(system_message_content)
        llm_with_tools = llm.bind_tools([vector_db, nasa_images, podcast])
        # Append messages to MessagesState
        response = llm_with_tools.invoke([system_message] + state['messages'])
        # Return updated MessagesState
        return {'messages': [response]}

    # NODE 2: Registers and executes tools if needed
    tools = ToolNode([vector_db, nasa_images, podcast])

    # NODE 3: Generate retrieval response
    def generate(state: MessagesState):
        """Generate answer based on retrieved data"""
        # Get generated ToolMessages
        recent_tool_messages = []
        for message in reversed(state['messages']):
            if message.type == 'tool':
                recent_tool_messages.append(message)
            else:
                break
        # Restore chronological order
        tool_messages = recent_tool_messages[::-1]
        # Format into retrieval prompt
        docs_content = '\n\n'.join(doc.content for doc in tool_messages)
        system_message_content = f"{prompt_retrieval}\n\n{docs_content}"
        conversation_history = [
            message for message in state['messages']
            if message.type in ('human', 'system')
            # Exclude AI tool call messages
            or (message.type == 'ai' and not message.tool_calls)
        ]
        prompt = [SystemMessage(system_message_content)] + conversation_history
        response = llm_podcast.invoke(prompt)
        return {'messages': [response]}

    # Initialize the Graph
    graph_builder = StateGraph(MessagesState)

    # Add Nodes
    graph_builder.add_node(query_or_respond)
    graph_builder.add_node(tools)
    graph_builder.add_node(generate)

    # Define entry point
    graph_builder.set_entry_point('query_or_respond')

    # Define dynamic flow
    graph_builder.add_conditional_edges(
        'query_or_respond',
        tools_condition,
        {END: END, 'tools': 'tools'}
    )

    # Define fixed transitions
    graph_builder.add_edge('tools', 'generate')
    graph_builder.add_edge('generate', END)

    # Compile the Graph
    graph = graph_builder.compile()

    # Store chatbot state in Redis and store empty conversation
    redis_client.set(session_key, json.dumps([]))

    print('Chatbot initialized...')

    return graph, session_key


# Get message response
def getMessage(graph, session_key, query):
    """Processes user query"""
    # Load chatbot history from Redis
    conversation_history = json.loads(redis_client.get(session_key) or "[]")
    global images_amount

    # Set tool data containers
    image_links = None
    podcast_teaser = None

    for step in graph.stream(
        # Append new query
        {'messages': conversation_history + [{'role': 'user', 'content': query}]},
        stream_mode = 'values'
    ):
        step['messages'][-1].pretty_print()

    # Extract tools data
    for msg in step['messages']:
        if getattr(msg, 'name', None) == 'nasa_images':
            image_links = json.loads(msg.content)
        if getattr(msg, 'name', None) == 'podcast':
            podcast_teaser = json.loads(msg.content)

    message = step['messages'][-1].content

    # Update conversation history
    conversation_history.append({'role': 'user', 'content': query})
    conversation_history.append({'role': 'assistant', 'content': message})
    redis_client.set(session_key, json.dumps(conversation_history))

    response = (message, image_links, podcast_teaser)

    return response


# Warm-up function
def warm_up_openai_client():
    try:
        client = OpenAI()
        # Send a short dummy request to preload
        client.audio.speech.create(
            model='tts-1',
            voice='ash',
            input="Hey there, explorers! This is just a warm-up for our space adventure ahead.",
            response_format='mp3'
        )
        print("Warm-up successful!")
    except Exception as e:
        print("Warm-up failed:", e)

# Retry logic for TTS generation
def generate_speech(podcastText, retries=3, delay=2):
    podcastClient = OpenAI()
    attempt = 0
    while attempt < retries:
        try:
            response = podcastClient.audio.speech.create(
                model='tts-1',
                voice='ash',
                input=podcastText,
                response_format='mp3'
            )
            return response.content
        except OpenAIError as e:
            attempt += 1
            print(f"Attempt {attempt} failed: {e}")
            time.sleep(delay * attempt)
    raise Exception("Failed to generate speech after retries.")

# Main podcast output function
def podcastOutput(request):
    warm_up_openai_client()

    # Parse JSON request body
    podcast = json.loads(request.body)
    print('GOING BACKEND', podcast)
    podcast_type = podcast['type']

    # Set up podcast text
    if podcast_type == 'Teaser':
        podcastText = podcast['podText']
    else:
        podcastTopic = podcast['podTopic']
        podcastText = podcastFull(podcastTopic)

    # Stream audio response
    def stream_audio():
        mp3_audio = generate_speech(podcastText)  # Single call to TTS generation
        yield mp3_audio

    # Set up response
    response = StreamingHttpResponse(stream_audio(), content_type='audio/mpeg')
    response['Content-Disposition'] = 'inline; filename="podcast.mp3"'
    response['Accept-Ranges'] = 'bytes'
    return response


# Create full podcast episode
def podcastFull():
    return 'This is going to be the full episode!'
