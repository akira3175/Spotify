from django.db import models
from django.contrib.auth.models import User  

class PaymentMethod(models.Model):
    name = models.CharField(max_length=50, unique=True) 

    def __str__(self):
        return self.name

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    song = models.ForeignKey('songs.Song', on_delete=models.CASCADE) 
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.SET_NULL, null=True) 
    price = models.DecimalField(max_digits=10, decimal_places=2)
    date_buy = models.DateTimeField(auto_now_add=True) 

    def __str__(self):
        return f"Order {self.id} - {self.user.username} - {self.song}"