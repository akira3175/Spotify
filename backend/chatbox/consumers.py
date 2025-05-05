from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import Message
from django.contrib.auth.models import User
from users.models import UserProfile
from asgiref.sync import sync_to_async

class ChatboxConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chatbox_id = self.scope['url_route']['kwargs']['chatbox_id']
        self.chatbox_group_name = f'chatbox_{self.chatbox_id}'

        await self.channel_layer.group_add(self.chatbox_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.chatbox_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        user_id = self.scope['user'].id

        # Lưu tin nhắn vào database và lấy created_at từ server
        saved_message = await self.save_message(user_id, self.chatbox_id, message)

        await self.channel_layer.group_send(
            self.chatbox_group_name,
            {
                'type': 'chat_message',
                'message': saved_message.message,
                'user_id': saved_message.user_id,
                'created_at': saved_message.created_at.isoformat()  # Convert to string
            }
        )

    async def chat_message(self, event):
        user = await self.get_user(event['user_id'])

        # Chạy hàm serialize_user và đảm bảo dữ liệu đã được tính toán
        user_data = await self.serialize_user(user)

        await self.send(text_data=json.dumps({
            'message': event['message'],
            'user': user_data,
            'created_at': event['created_at']  # Đã là string
        }))

    @sync_to_async
    def save_message(self, user_id, chatbox_id, message):
        return Message.objects.create(
            user_id=user_id,
            chatbox_id=chatbox_id,
            message=message
        )

    @sync_to_async
    def get_user(self, user_id):
        return User.objects.get(id=user_id)

    @sync_to_async
    def serialize_user(self, user):
        profile = getattr(user, 'profile', None) 

        # Đảm bảo rằng tất cả các đối tượng bất đồng bộ đã được xử lý
        return {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'avatar': profile.avatar.url if profile and profile.avatar else None,
            'is_active': user.is_active,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'last_login': user.last_login.isoformat() if user.last_login else None,
            'date_joined': user.date_joined.isoformat() if user.date_joined else None
        }
