from django.shortcuts import render
from .models import Artist, Follow
from .serializers import ArtistSerializer, FollowSerializer
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework import filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound

class ArtistListCreateView(generics.ListCreateAPIView):
    queryset = Artist.objects.filter(is_deleted=False)
    serializer_class = ArtistSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['artist_name']

class FollowedArtistView(generics.ListAPIView):
    serializer_class = ArtistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Artist.objects.filter(follow__user=user, is_deleted=False).distinct()


class ArtistRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Artist.objects.filter(is_deleted=False)
    serializer_class = ArtistSerializer

    def destroy(self, request, *args, **kwargs):
        artist = self.get_object()
        artist.is_deleted = True
        artist.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Follow artist (POST)
class FollowArtistView(generics.CreateAPIView):
    serializer_class = FollowSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'artist_id'

    def perform_create(self, serializer):
        artist_id = self.kwargs['artist_id']    
        try:
            artist = Artist.objects.get(id=artist_id)
        except Artist.DoesNotExist:
            raise NotFound("Artist not found")

        serializer.save(user=self.request.user, artist=artist)

# Unfollow artist (DELETE)
class UnfollowArtistView(generics.DestroyAPIView):
    serializer_class = FollowSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'artist_id'


    def get_queryset(self):
        return Follow.objects.filter(user=self.request.user, artist_id=self.kwargs['artist_id'])

# Kiểm tra đã follow chưa (GET)
class IsFollowingArtistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, artist_id):
        is_following = Follow.objects.filter(user=request.user, artist_id=artist_id).exists()
        return Response({"isFollowing": is_following})