from rest_framework import serializers
from .models import Order, PaymentMethod
from songs.serializers import SongSerializer

class OrderSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    song = SongSerializer()
    
    class Meta:
        model = Order
        fields = '__all__'

class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = '__all__'


    
