from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Friend, StatusFriend, UserProfile

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

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})

        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()

        profile, created = UserProfile.objects.get_or_create(user=instance)

        profile.avatar = profile_data.get('avatar', profile.avatar)
        profile.bio = profile_data.get('bio', profile.bio)
        profile.save()

        return instance

class FriendSerializer(serializers.ModelSerializer):
    user1 = serializers.SlugRelatedField(slug_field="username", queryset=User.objects.all())
    user2 = serializers.SlugRelatedField(slug_field="username", queryset=User.objects.all())
    status = serializers.SlugRelatedField(slug_field="name", queryset=StatusFriend.objects.all())

    class Meta:
        model = Friend
        fields = ['id', 'user1', 'user2', 'status', 'created_at']
        read_only_fields = ['created_at']
