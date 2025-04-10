from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Friend, StatusFriend

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
    
class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name']

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()
        return instance

class FriendSerializer(serializers.ModelSerializer):
    user1 = serializers.SlugRelatedField(slug_field="username", queryset=User.objects.all())
    user2 = serializers.SlugRelatedField(slug_field="username", queryset=User.objects.all())
    status = serializers.SlugRelatedField(slug_field="name", queryset=StatusFriend.objects.all())

    class Meta:
        model = Friend
        fields = ['id', 'user1', 'user2', 'status', 'created_at']
        read_only_fields = ['created_at']
