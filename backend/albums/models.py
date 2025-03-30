from django.db import models
from artists.models import *
from songs.models import *
from django.contrib.auth.models import User

class Album(models.Model):
    album_name = models.CharField(max_length=255, null=False)
    artist = models.ForeignKey('artists.Artist', on_delete=models.CASCADE)
    release_date = models.DateField(null=True, blank=True)
    album_cover_url = models.URLField(null=True, blank=True)
    song = models.ManyToManyField(Song, related_name='albums')
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.album_name
    