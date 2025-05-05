from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Chatbox, Message, ChatboxMember
from .serializers import ChatboxSerializer, MessageSerializer, ChatboxMemberSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework.exceptions import PermissionDenied
from django.db import models
from rest_framework.exceptions import ValidationError
from django.db.models import Count, Q
from rest_framework.response import Response

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db.models import Count, Q
from .models import Chatbox, ChatboxMember
from .serializers import ChatboxSerializer

class ChatboxListCreateView(generics.ListCreateAPIView):
    queryset = Chatbox.objects.all()
    serializer_class = ChatboxSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Chatbox.objects.filter(chatboxmember__user=self.request.user)

    def create(self, request, *args, **kwargs):
        user_ids = set([request.user.id] + request.data.get("user_ids", []))

        existing = Chatbox.objects.filter(
            type="user",
            chatboxmember__user__id__in=user_ids
        ).annotate(
            matched=Count('chatboxmember', filter=Q(chatboxmember__user__id__in=user_ids)),
            total=Count('chatboxmember')
        ).filter(matched=len(user_ids), total=len(user_ids)).first()

        # ✅ Nếu đã tồn tại, trả lại luôn thông tin chatbox
        if existing:
            serializer = self.get_serializer(existing)
            return Response(serializer.data, status=200)

        # ✅ Nếu chưa tồn tại, tạo mới
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        chatbox = serializer.save()

        ChatboxMember.objects.create(chatbox=chatbox, user=request.user)
        for uid in user_ids:
            if uid != request.user.id:
                ChatboxMember.objects.create(chatbox=chatbox, user_id=uid)

        return Response(self.get_serializer(chatbox).data, status=201)

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        chatbox_id = self.kwargs['chatbox_id']
        if not ChatboxMember.objects.filter(chatbox_id=chatbox_id, user=self.request.user).exists():
            return Message.objects.none()
        return Message.objects.filter(chatbox_id=chatbox_id)

    def perform_create(self, serializer):
        chatbox_id = self.kwargs['chatbox_id']

        if not ChatboxMember.objects.filter(chatbox_id=chatbox_id, user=self.request.user).exists():
            raise ValidationError("Bạn không có quyền gửi tin nhắn vào đoạn chat này.")

        chatbox = Chatbox.objects.get(id=chatbox_id)
        message = serializer.save(user=self.request.user, chatbox=chatbox)

        send_message_to_ws_group(chatbox_id, message.user.id, message.message, message.created_at)

def send_message_to_ws_group(chatbox_id, user_id, message_text, created_at):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"chatbox_{chatbox_id}",
        {
            "type": "chat_message",
            "message": message_text,
            "user_id": user_id,
            "created_at": created_at.isoformat()
        }
    )

