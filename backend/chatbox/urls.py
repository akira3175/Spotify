from django.urls import path
from .views import ChatboxListCreateView, MessageListCreateView

urlpatterns = [
    path('', ChatboxListCreateView.as_view(), name='chatbox-list-create'),
    path('<int:chatbox_id>/messages/', MessageListCreateView.as_view(), name='message-list-create'),
]
