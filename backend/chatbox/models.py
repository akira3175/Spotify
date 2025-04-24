from django.db import models
from django.contrib.auth.models import User

chatboxType = [
    ('user', 'user'),
    ('group', 'group'),
]

class Chatbox(models.Model):
    name = models.CharField(max_length=255, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=10, choices=chatboxType)

    def __str__(self):
        return f"{self.name}"
    
class ChatboxMember(models.Model):
    chatbox = models.ForeignKey(Chatbox, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.chatbox.name} - {self.user.username}"

class Message(models.Model):
    chatbox = models.ForeignKey(Chatbox, on_delete=models.CASCADE)
    message = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.chatbox.name} - {self.user.username}"

