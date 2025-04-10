from django.contrib import admin
from .models import Playlist

@admin.register(Playlist)
class PlaylistAdmin(admin.ModelAdmin):
    list_display = ('id', 'playlist_name', 'description', 'playlist_cover_url', 'is_public', 'user')
    list_filter = ('is_public', 'user')
    search_fields = ('playlist_name', 'description')
    list_per_page = 10


    
