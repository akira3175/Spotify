from rest_framework import serializers
from .models import Song, Genres
from artists.serializers import ArtistSerializer

class SongSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only=True)

    class Meta:
        model = Song
        fields = '__all__'

class SongSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = '__all__'

class GenresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genres
        fields = '__all__'


