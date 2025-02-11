from django.urls import path

from . import views

urlpatterns = [
    # Home view
    path('', views.index, name = 'index'),
    # Get Chatbot response
    path('response/', views.response, name = 'response'),
    # Chatbot memory reset
    path('reset/', views.reset, name = 'reset')
    ]
