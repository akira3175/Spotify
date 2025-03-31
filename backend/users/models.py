from django.db import models
from django.contrib.auth.models import User

class StatusFriend(models.Model):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DECLINED = "declined"

    STATUS_CHOICES = [
        (PENDING, "Pending"),
        (ACCEPTED, "Accepted"),
        (DECLINED, "Declined"),
    ]

    name = models.CharField(max_length=255, choices=STATUS_CHOICES, unique=True)

    def __str__(self):
        return self.name


class Friend(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user2')
    status = models.ForeignKey(StatusFriend, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user1} - {self.user2} - {self.status}"

    def save(self, *args, **kwargs):
        if self.user1.id > self.user2.id:
            self.user1, self.user2 = self.user2, self.user1
        super().save(*args, **kwargs)

