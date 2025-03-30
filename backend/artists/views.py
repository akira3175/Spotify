from django.shortcuts import render
from .models import Artist
from .serializers import ArtistSerializer
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status

class ArtistListCreateView(generics.ListCreateAPIView):
    queryset = Artist.objects.filter(is_deleted=False)
    serializer_class = ArtistSerializer

class ArtistRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Artist.objects.filter(is_deleted=False)
    serializer_class = ArtistSerializer

    def destroy(self, request, *args, **kwargs):
        artist = self.get_object()
        artist.is_deleted = True
        artist.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

