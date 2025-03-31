from django.shortcuts import render
from .models import Order, PaymentMethod
from .serializers import OrderSerializer, PaymentMethodSerializer
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status

class OrderListCreateView(generics.ListCreateAPIView):
    queryset = Order.objects.filter()
    serializer_class = OrderSerializer

class OrderRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.filter()
    serializer_class = OrderSerializer

    def destroy(self, request, *args, **kwargs):
        pass

class PaymentMethodListCreateView(generics.ListCreateAPIView):
    queryset = PaymentMethod.objects.filter()
    serializer_class = PaymentMethodSerializer

class PaymentMethodRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PaymentMethod.objects.filter()
    serializer_class = PaymentMethodSerializer
