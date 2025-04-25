from django.contrib import admin
from .models import UserProfile, Friend, StatusFriend
# Register your models here.
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'avatar', 'bio')

@admin.register(Friend)
class FriendAdmin(admin.ModelAdmin):
    list_display = ('user1', 'user2', 'status')

@admin.register(StatusFriend)
class StatusFriendAdmin(admin.ModelAdmin):
    list_display = ('name',)
