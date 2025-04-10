from rest_framework import serializers
from .models import Playlist
from songs.models import Song
class PlaylistSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    song = serializers.PrimaryKeyRelatedField(
        queryset=Song.objects.all(),
        many=True,
        required=False  
    )

    class Meta:
        model = Playlist
        fields = '__all__'
        extra_kwargs = {
            'playlist_cover_url': {'required': False},
        }
