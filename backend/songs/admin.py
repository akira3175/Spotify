from django.contrib import admin
from .models import Song, Genres

@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ('song_name', 'artist', 'albums', 'release_date', 'is_deleted')
    list_filter = ('is_deleted',)

@admin.register(Genres)
class GenresAdmin(admin.ModelAdmin):
    list_display = ('genre_name', 'description')
    list_filter = ('genre_name',)

