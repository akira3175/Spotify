from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import Message
from django.contrib.auth.models import User
from asgiref.sync import sync_to_async

class ChatboxConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chatbox_id = self.scope['url_route']['kwargs']['chatbox_id']
        self.chatbox_group_name = f'chatbox_{self.chatbox_id}'

        # Thêm người dùng vào nhóm chat
        await self.channel_layer.group_add(self.chatbox_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Gỡ người dùng khỏi nhóm chat
        await self.channel_layer.group_discard(self.chatbox_group_name, self.channel_name)

    async def receive(self, text_data):
        # Xử lý tin nhắn gửi đến
        data = json.loads(text_data)
        message = data['message']
        user_id = self.scope['user'].id  # Sử dụng thông tin người dùng đã xác thực

        # Lưu tin nhắn vào cơ sở dữ liệu
        await self.save_message(user_id, self.chatbox_id, message)

        # Gửi tin nhắn đến tất cả thành viên trong nhóm chat
        await self.channel_layer.group_send(
            self.chatbox_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user_id': user_id
            }
        )

    async def chat_message(self, event):
        # Lấy thông tin người dùng từ event
        user = await self.get_user(event['user_id'])

        # Gửi tin nhắn đến WebSocket của người dùng
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'user': user.username,
        }))

    @sync_to_async
    def save_message(self, user_id, chatbox_id, message):
        # Lưu tin nhắn vào cơ sở dữ liệu
        return Message.objects.create(
            user_id=user_id,
            chatbox_id=chatbox_id,
            message=message
        )

    @sync_to_async
    def get_user(self, user_id):
        # Lấy thông tin người dùng từ cơ sở dữ liệu
        return User.objects.get(id=user_id)
