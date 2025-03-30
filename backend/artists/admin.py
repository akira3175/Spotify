from django.contrib import admin
from .models import Artist, Follow

@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ('artist_name', 'artist_bio', 'artist_picture_url', 'user', 'is_deleted')
    list_filter = ('is_deleted',)
    search_fields = ('artist_name', 'user__username')
    list_per_page = 10
    
@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = ('artist', 'user')
    list_filter = ('artist', 'user')
    search_fields = ('artist__artist_name', 'user__username')
    list_per_page = 10

