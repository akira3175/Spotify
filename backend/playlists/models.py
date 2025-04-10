from django.db import models
from django.contrib.auth.models import User
from songs.models import Song

class Playlist(models.Model):
    user = models.ForeignKey(User, blank=False, null=False, on_delete=models.CASCADE)
    playlist_name = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_public = models.BooleanField(default=False)
    playlist_cover_url = models.URLField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False)
    song = models.ManyToManyField(Song, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.playlist_name