from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('check-username-and-email/', CheckUsernameAndEmailView.as_view(), name='check-user'),
    path('update-user/', UpdateUserView.as_view(), name='update-user'),
    path('', UserListView.as_view(), name='user-list'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path("send-request/", SendFriendRequestView.as_view(), name="send-friend-request"),
    path("respond-request/<int:pk>/", RespondFriendRequestView.as_view(), name="respond-friend-request"),
    path("cancel-request/<int:pk>/", CancelFriendRequestView.as_view(), name="cancel-friend-request"),
    path("remove-friend/<int:pk>/", RemoveFriendView.as_view(), name="remove-friend"),
    path("friends/", ListFriendsView.as_view(), name="list-friends"),
    path("pending-requests/", ListPendingRequestsView.as_view(), name="list-pending-requests"),
    path("sent-requests/", ListSentRequestsView.as_view(), name="list-sent-requests"),
]
