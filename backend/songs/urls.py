from django.urls import path
from .views import *

urlpatterns = [
    path('', SongListCreateView.as_view(), name='song-list-create'),
    path('<int:pk>/', SongRetrieveUpdateDestroyView.as_view(), name='song-detail'),
    path('genres/', GenresListCreateView.as_view(), name='genres-list-create'),
    path('genres/<int:pk>/', GenresRetrieveUpdateDestroyView.as_view(), name='genres-detail'),
]
