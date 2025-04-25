from django.db import models
from django.contrib.auth.models import User

class StatusFriend(models.Model):
    """
    Model đại diện cho trạng thái kết bạn giữa hai người dùng.

    Các trạng thái mặc định:
    - 'pending'  : Yêu cầu kết bạn đang chờ xử lý.
    - 'accepted' : Hai người đã trở thành bạn bè.
    - 'declined' : Yêu cầu kết bạn bị từ chối.

    Trường:
    - name: Giá trị trạng thái, chỉ được chọn từ STATUS_CHOICES và phải duy nhất.
    """
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
    """
    Model đại diện cho mối quan hệ bạn bè giữa hai người dùng.

    Trường:
    - user1, user2 : Hai người dùng trong mối quan hệ bạn bè.
    - status       : Trạng thái của mối quan hệ (pending, accepted, declined).
    - created_at   : Thời điểm tạo mối quan hệ.

    Ghi chú:
    - user1 luôn có ID nhỏ hơn user2 để tránh trùng lặp mối quan hệ theo chiều ngược lại.
    - Mối quan hệ là duy nhất giữa 2 người (nếu cần bạn có thể thêm ràng buộc unique_together).
    """
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

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(blank=True)
