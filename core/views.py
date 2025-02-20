
import json

from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie

from .utils import chatbotInit, getMessage, redis_client, podcastOutput


# Global variables to store chatbot state
graph = None
config = None


@ensure_csrf_cookie
# Main index view
def index(request):
    global graph
    graph, session_key = chatbotInit()
    request.session['chatbot_session_key'] = session_key
    # Render the 'index.html' template
    return render(request, 'index.html')

# Get Chatbot response
def response(request):
    global graph
    if request.method == 'POST':
        query = json.loads(request.body)['query']
        # Retrieve session key from request
        session_key = request.session.get('chatbot_session_key', None)
        # Initialize chatbot if session key is missing
        if not session_key:
            graph, session_key = chatbotInit()
            request.session['chatbot_session_key'] = session_key
        response = getMessage(graph, session_key, query)
        context = {'response': response}
    return JsonResponse(context)

# Get Podcast
def podcast(request):
    if request.method == 'POST':
        return podcastOutput(request)
    return HttpResponse(status = 204)

# Reset Chatbot memory
def reset(request):
    if request.method == 'POST':
        session_key = request.session.get('chatbot_session_key', None)
        if session_key:
            # Reset conversation history
            redis_client.set(session_key, json.dumps([]))
        # Clear session data
        request.session.flush()
    return HttpResponse(status = 204)
