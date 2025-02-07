from django.shortcuts import render

# Main index view
def index(request):
    # Render the 'index.html' template
    return render(request, 'index.html')
