from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from django.contrib.auth.models import User
from .serializers import *

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({
            "message": "Login successful",
            "username": self.user.username,
        })
        return data

class LoginAPIView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
    
class CheckUsernameAndEmailView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        username = request.query_params.get('username')
        email = request.query_params.get('email')

        response_data = {}
        if username:
            response_data['username_exists'] = User.objects.filter(username=username).exists()
        if email:
            response_data['email_exists'] = User.objects.filter(email=email).exists()

        if not response_data:
            return Response({'error': 'At least one parameter (username or email) is required'}, status=400)

        return Response(response_data)
    
class UpdateUserView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UpdateUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user  # Chỉ cho phép user cập nhật chính mình
