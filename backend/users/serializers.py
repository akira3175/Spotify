from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Friend, StatusFriend, UserProfile
from django.db import transaction

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        print('validated_data:', validated_data)
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )

        UserProfile.objects.create(user=user)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['avatar', 'bio']

class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(source='profile.avatar', read_only=True)
    bio = serializers.CharField(source='profile.bio', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'avatar', 'bio']

class UpdateUserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(source='profile.avatar', required=False)
    bio = serializers.CharField(source='profile.bio', required=False)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'avatar', 'bio']

class UpdateUserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(source='profile.avatar', required=False)
    bio    = serializers.CharField(   source='profile.bio',    required=False)

    class Meta:
        model  = User
        fields = ['first_name', 'last_name', 'avatar', 'bio']

    @transaction.atomic
    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})

        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name  = validated_data.get('last_name',  instance.last_name)
        instance.save()

        profile, _ = UserProfile.objects.get_or_create(user=instance)
        if 'avatar' in profile_data:
            profile.avatar = profile_data['avatar']
        if 'bio' in profile_data:
            profile.bio = profile_data['bio']
        profile.save()

        return instance

class FriendSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    status = serializers.SlugRelatedField(slug_field="name", queryset=StatusFriend.objects.all())

    class Meta:
        model = Friend
        fields = ['id', 'user', 'status', 'created_at']
        read_only_fields = ['created_at']

    def get_user(self, obj):
        request_user = self.context['request'].user
        if obj.user1 == request_user:
            return UserSerializer(obj.user2).data
        else:
            return UserSerializer(obj.user1).data
