from rest_framework import serializers
from .models import Artist, Follow
from songs.models import Song

class ArtistSerializer(serializers.ModelSerializer):
    songs = serializers.SerializerMethodField()

    class Meta:
        model = Artist
        fields = '__all__'

    def get_songs(self, obj):
        from songs.serializers import SongSimpleSerializer
        songs = Song.objects.filter(artist=obj)
        return SongSimpleSerializer(songs, many=True).data

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ['id', 'user']
        read_only_fields = ['user']