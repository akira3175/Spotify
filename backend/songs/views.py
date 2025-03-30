from django.shortcuts import render
from rest_framework import generics
from .models import Song, Genres
from .serializers import SongSerializer, GenresSerializer
from rest_framework.response import Response
from rest_framework import status

class SongListCreateView(generics.ListCreateAPIView):
    queryset = Song.objects.filter(is_deleted=False)
    serializer_class = SongSerializer

class SongRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Song.objects.filter(is_deleted=False)
    serializer_class = SongSerializer

    def destroy(self, request, *args, **kwargs):
        song = self.get_object()
        song.is_deleted = True
        song.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class GenresListCreateView(generics.ListCreateAPIView):
    queryset = Genres.objects.all()
    serializer_class = GenresSerializer

class GenresRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Genres.objects.all()
    serializer_class = GenresSerializer


