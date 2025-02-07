from django.urls import path

from . import views

urlpatterns = [
    # Home view
    path('', views.index, name = 'index')
    ]
