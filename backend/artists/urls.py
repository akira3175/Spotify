from django.urls import path
from .views import *

urlpatterns = [
    path('', ArtistListCreateView.as_view(), name='artist-list-create'),
    path('<int:pk>/', ArtistRetrieveUpdateDestroyView.as_view(), name='artist-detail'),
    path('followed/', FollowedArtistView.as_view(), name='followed-artist-list'),
    path('<int:artist_id>/follow/', FollowArtistView.as_view(), name='follow-artist'),
    path('<int:artist_id>/unfollow/', UnfollowArtistView.as_view(), name='unfollow-artist'),
    path('<int:artist_id>/is-following/', IsFollowingArtistView.as_view(), name='is-following-artist'),
]
