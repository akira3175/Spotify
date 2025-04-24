from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Chatbox, Message, ChatboxMember
from .serializers import ChatboxSerializer, MessageSerializer, ChatboxMemberSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class ChatboxListCreateView(generics.ListCreateAPIView):
    queryset = Chatbox.objects.all()
    serializer_class = ChatboxSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Chatbox.objects.filter(chatboxmember__user=self.request.user)

class MessageListCreateView(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(chatbox=self.kwargs['chatbox_id'])
    
    def perform_create(self, serializer):
        message = serializer.save(user=self.request.user, chatbox=Chatbox.objects.get(id=self.kwargs['chatbox_id']))
        send_message_to_ws_group(message.chatbox_id, message.user_id, message.message)

def send_message_to_ws_group(chatbox_id, user_id, message_text):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"chatbox_{chatbox_id}",
        {
            "type": "chat_message",
            "message": message_text,
            "user_id": user_id
        }
    )

