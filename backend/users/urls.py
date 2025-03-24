from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('check-username-and-email/', CheckUsernameAndEmailView.as_view(), name='check-user'),
    path('update-user/', UpdateUserView.as_view(), name='update-user'),
]
