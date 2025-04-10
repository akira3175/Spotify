from django.urls import path
from .views import AlbumListCreateView, AlbumRetrieveUpdateDestroyView

urlpatterns = [
    path('', AlbumListCreateView.as_view(), name='album-list-create'),
    path('<int:pk>/', AlbumRetrieveUpdateDestroyView.as_view(), name='album-retrieve-update-destroy'),
]

