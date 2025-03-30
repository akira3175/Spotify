from django.db import models
from django.utils import timezone

class Genres(models.Model):
    genre_name = models.CharField(max_length=255, null=False, unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.genre_name
    
class Song(models.Model):
    artist = models.ForeignKey('artists.Artist', on_delete=models.CASCADE)
    song_name = models.CharField(max_length=255, null=False)
    duration = models.IntegerField(null=True, blank=True)  # Giả sử là số giây
    audio = models.FileField(upload_to='audio/', null=True, blank=True)
    plays = models.IntegerField(default=0)
    lyrics_text = models.TextField(null=True, blank=True)
    source = models.TextField(null=True, blank=True)
    genres = models.ManyToManyField(Genres)
    is_deleted = models.BooleanField(default=False)
    release_date = models.DateField(null=True, blank=True, default=timezone.now)

    def __str__(self):
        return self.song_name