from rest_framework import serializers
from .models import Playlist
from songs.models import Song
from songs.serializers import SongSerializer

class PlaylistSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    song = SongSerializer(many=True, read_only=True)

    song_id = serializers.PrimaryKeyRelatedField(
        queryset=Song.objects.all(),
        many=True,
        required=False,
        source='song'
    )

    class Meta:
        model = Playlist
        fields = '__all__'
        extra_kwargs = {
            'playlist_cover_url': {'required': False},
        }
