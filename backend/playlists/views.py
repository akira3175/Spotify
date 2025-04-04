from django.shortcuts import render
from .models import Playlist
from .serializers import PlaylistSerializer
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions

class PlaylistListCreateView(generics.ListCreateAPIView):
    queryset = Playlist.objects.filter(is_deleted=False)
    serializer_class = PlaylistSerializer
    permission_classes = [permissions.IsAuthenticated]  # Chỉ cho phép user đã đăng nhập

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PlaylistRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Playlist.objects.filter(is_deleted=False)
    serializer_class = PlaylistSerializer
    permission_classes = [permissions.IsAuthenticated]  # Chỉ cho phép user đã đăng nhập

    def destroy(self, request, *args, **kwargs):
        playlist = self.get_object()
        playlist.is_deleted = True
        playlist.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
