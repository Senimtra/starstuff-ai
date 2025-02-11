import os
import uuid

from dotenv import load_dotenv

from langchain_chroma import Chroma
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.tools import tool
from langchain_core.messages import SystemMessage

from langgraph.graph import MessagesState, StateGraph, END
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.checkpoint.memory import MemorySaver

load_dotenv('../.env')

os.environ['LANGSMITH_TRACING'] = 'true'
os.environ['LANGSMITH_API_KEY'] = os.getenv('LANGSMITH')
os.environ['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')

def chatbotInit():
    # Chat Model
    llm = ChatOpenAI(model = 'gpt-4o-mini')
    # Embeddings Model
    embeddings = OpenAIEmbeddings(model = 'text-embedding-3-large')
    # Chroma DB Vector Store
    vector_store = Chroma(persist_directory = '../chroma_db', embedding_function = embeddings)

    # LLM short-circuit prompt
    prompt_short_circuit = (
        "Your name is Professor Starstuff. Never add anything else, when asked about yourself"
        "If the query contains factual questions, retrieve documents."
        "If the query is conversation, respond immediately."
        "You love astronomy and to engage with curious kids!"
        "Keep your response short, and fun (five sentences max)."
        "Add single relevant emojies within the text."
        "Always make sure to end the response with an emoji."
    )

    # Retrieval step prompt
    prompt_retrieval = """
        Your name is Professor Starstuff. Never add anything else, when asked about yourself. 
        You're a friendly and enthusiastic astronomy teacher who loves explaining space facts to curious kids! 
        Use the following pieces of context to answer the question at the end in a fun, simple, and engaging way. 
        If you don't know the answer, just say that you don't know—it's okay to be honest! 
        Keep your explanation short, fun, and easy to understand (five sentences max). 
        Use playful language, examples, or comparisons to make the answer exciting for kids. 
        Always end with an encouraging phrase like "Keep looking up!" or "Space is awesome, isn't it?" to keep them excited about learning. 
        Add single relevant emojies within the text. Always make sure to end the response with a single emoji.
        """

    # Retrieval step tool
    @tool(response_format = 'content_and_artifact')
    def retrieve(query: str):
        """Retrieve astronomical information chunks from chromaDB"""
        retrieved_docs = vector_store.similarity_search(query, k = 2)
        serialized = '\n\n'.join(
            (f"Source: {doc.metadata}\nContent: {doc.page_content}")
            for doc in retrieved_docs
        )
        return serialized, retrieved_docs
    
    # NODE 1: LLM decides to retrieve documents or respond immediately
    def query_or_respond(state: MessagesState):
        """Generate tools call for retrieval or respond"""
        system_message_content = prompt_short_circuit
        system_message = SystemMessage(system_message_content)
        llm_with_tools = llm.bind_tools([retrieve])
        # Appends messages to MessagesState
        response = llm_with_tools.invoke([system_message] + state['messages'])
        # Return updated MessagesState
        return {'messages': [response]}

    # NODE 2: Registers and executes retrieval if needed
    tools = ToolNode([retrieve])

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

        response = llm.invoke(prompt)
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

    # Simple in-memory checkpointer
    memory = MemorySaver()

    # Compile the Graph
    graph = graph_builder.compile(checkpointer = memory)

    # Set session thread_id
    config = {'configurable': {'thread_id': str(uuid.uuid4())}}

    print('Chatbot initialized...')

    return graph, config

def getMessage(graph, config, query):
    """Processes user query using pipeline"""
    for step in graph.stream(
        {'messages': [{'role': 'user', 'content': query}]},
        stream_mode = 'values',
        config = config
    ):
        step['messages'][-1].pretty_print()
        response = step['messages'][-1].content
    return response
