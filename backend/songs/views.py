from django.shortcuts import render
from rest_framework import generics
from .models import Song, Genres
from .serializers import SongSerializer, GenresSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework import filters

class SongListCreateView(generics.ListCreateAPIView):
    queryset = Song.objects.filter(is_deleted=False)
    serializer_class = SongSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['song_name']

    def get_queryset(self):
        queryset = Song.objects.filter(is_deleted=False)
        genre_id = self.request.query_params.get('genre_id', None)
        if genre_id:
            queryset = queryset.filter(genres__id=genre_id)
        return queryset
    
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


