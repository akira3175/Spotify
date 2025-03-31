from django.urls import path
from .views import PlaylistListCreateView, PlaylistRetrieveUpdateDestroyView

urlpatterns = [
    path('', PlaylistListCreateView.as_view(), name='playlist-list-create'),
    path('<int:pk>/', PlaylistRetrieveUpdateDestroyView.as_view(), name='playlist-retrieve-update-destroy'),
]
