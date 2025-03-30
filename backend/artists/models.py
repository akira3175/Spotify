from django.db import models
from django.contrib.auth.models import User
from songs.models import Genres

class Artist(models.Model):
    artist_name = models.CharField(max_length=255, null=False)
    artist_bio = models.TextField(null=True, blank=True, default=None)
    artist_picture_url = models.URLField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    genres = models.ManyToManyField(Genres)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.artist_name
    
class Follow(models.Model):
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('artist', 'user')