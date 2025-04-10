from django.shortcuts import render
from rest_framework import viewsets
from .models import Album
from .serializers import AlbumSerializer
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework import filters

class AlbumListCreateView(generics.ListCreateAPIView):
    queryset = Album.objects.filter(is_deleted=False)
    serializer_class = AlbumSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['album_name', 'artist__name']

class AlbumRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Album.objects.filter(is_deleted=False)
    serializer_class = AlbumSerializer

    def destroy(self, request, *args, **kwargs):
        album = self.get_object()
        album.is_deleted = True
        album.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


