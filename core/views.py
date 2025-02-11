from django.shortcuts import render
from .utils import chatbotInit, getMessage
from django.http import JsonResponse, HttpResponse
import json

# Global variables to store chatbot state
graph = None
config = None

# Main index view
def index(request):
    global graph, config
    # Initialize chatbot
    graph, config = chatbotInit()
    # Render the 'index.html' template
    return render(request, 'index.html')

# Get Chatbot response
def response(request):
    if request.method == 'POST':
        query = json.loads(request.body)['query']
        response = getMessage(graph, config, query)
        context = {'response': response}
    return JsonResponse(context)

# Reset Chatbot memory
def reset(request):
    if request.method == "POST":
        global graph, config
        graph, config = chatbotInit()
    return HttpResponse(status = 204)
