from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from django.contrib.auth.models import User
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters
from rest_framework.parsers import MultiPartParser, FormParser

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
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return self.request.user  # Chỉ cho phép user cập nhật chính mình

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']

class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class SendFriendRequestView(generics.CreateAPIView):
    """
    Gửi lời mời kết bạn
    """
    serializer_class = FriendSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user1 = request.user
        user2_username = request.data.get("user2")

        if not user2_username:
            return Response({"error": "Thiếu username của người cần kết bạn."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user2 = User.objects.get(username=user2_username)
        except User.DoesNotExist:
            return Response({"error": "Người dùng không tồn tại."}, status=status.HTTP_404_NOT_FOUND)

        if user1 == user2:
            return Response({"error": "Không thể kết bạn với chính mình."}, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra xem đã gửi lời mời trước đó chưa
        if Friend.objects.filter(user1=user1, user2=user2).exists() or Friend.objects.filter(user1=user2, user2=user1).exists():
            return Response({"error": "Lời mời kết bạn đã tồn tại."}, status=status.HTTP_400_BAD_REQUEST)

        pending_status = StatusFriend.objects.get(name=StatusFriend.PENDING)

        friend_request = Friend.objects.create(user1=user1, user2=user2, status=pending_status)
        return Response(FriendSerializer(friend_request).data, status=status.HTTP_201_CREATED)


class RespondFriendRequestView(generics.UpdateAPIView):
    """
    Chấp nhận hoặc từ chối lời mời kết bạn
    """
    serializer_class = FriendSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        friend_request_id = kwargs.get("pk")
        action = request.data.get("action")  # "accept" hoặc "decline"

        try:
            friend_request = Friend.objects.get(id=friend_request_id)
        except Friend.DoesNotExist:
            return Response({"error": "Lời mời kết bạn không tồn tại."}, status=status.HTTP_404_NOT_FOUND)

        if friend_request.user2 != request.user:
            return Response({"error": "Bạn không có quyền thực hiện hành động này."}, status=status.HTTP_403_FORBIDDEN)

        if action == "accept":
            friend_request.status = StatusFriend.objects.get(name=StatusFriend.ACCEPTED)
        elif action == "decline":
            friend_request.status = StatusFriend.objects.get(name=StatusFriend.DECLINED)
        else:
            return Response({"error": "Hành động không hợp lệ."}, status=status.HTTP_400_BAD_REQUEST)

        friend_request.save()
        return Response(FriendSerializer(friend_request).data)


class RemoveFriendView(generics.DestroyAPIView):
    """
    Hủy kết bạn
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        friend_id = kwargs.get("pk")

        try:
            friendship = Friend.objects.get(id=friend_id, status__name=StatusFriend.ACCEPTED)
        except Friend.DoesNotExist:
            return Response({"error": "Bạn không có quyền xóa bạn bè này hoặc người này không phải bạn bè."}, status=status.HTTP_404_NOT_FOUND)

        if request.user != friendship.user1 and request.user != friendship.user2:
            return Response({"error": "Bạn không có quyền thực hiện hành động này."}, status=status.HTTP_403_FORBIDDEN)

        friendship.delete()
        return Response({"message": "Đã hủy kết bạn thành công."}, status=status.HTTP_204_NO_CONTENT)


class ListFriendsView(generics.ListAPIView):
    """
    Danh sách bạn bè
    """
    serializer_class = FriendSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Friend.objects.filter(
            (models.Q(user1=self.request.user) | models.Q(user2=self.request.user)),
            status__name=StatusFriend.ACCEPTED
        )