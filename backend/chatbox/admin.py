from django.contrib import admin
from .models import Message, Chatbox, ChatboxMember

# Register your models here.
@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'created_at')
    list_filter = ('user', 'created_at')
    search_fields = ('user__username', 'message')
    readonly_fields = ('created_at',)

@admin.register(Chatbox)
class ChatboxAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)
    readonly_fields = ('created_at',)

@admin.register(ChatboxMember)
class ChatboxMemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'chatbox', 'is_admin')
    list_filter = ('user', 'chatbox', 'is_admin')
    search_fields = ('user__username', 'chatbox__name')

