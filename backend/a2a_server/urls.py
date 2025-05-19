from django.urls import path
from . import views

urlpatterns = [
    path('jsonrpc/', views.jsonrpc, name='jsonrpc'),
] 