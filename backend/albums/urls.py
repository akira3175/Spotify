from django.urls import path
from .views import AlbumListCreateView, AlbumRetrieveUpdateDestroyView

urlpatterns = [
    path('albums/', AlbumListCreateView.as_view(), name='album-list-create'),
    path('albums/<int:pk>/', AlbumRetrieveUpdateDestroyView.as_view(), name='album-retrieve-update-destroy'),
]

