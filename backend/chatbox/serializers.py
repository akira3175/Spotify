from rest_framework import serializers
from .models import Chatbox, Message, ChatboxMember
from users.serializers import UserSerializer

class ChatboxSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()

    class Meta:
        model = Chatbox
        fields = ['id', 'name', 'members', 'created_at', 'type']

    def get_members(self, obj):
        members = ChatboxMember.objects.filter(chatbox=obj)
        return ChatboxMemberSerializer(members, many=True).data

class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'message', 'created_at', 'user']

class ChatboxMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ChatboxMember
        fields = ['id', 'chatbox', 'user', 'is_admin']


