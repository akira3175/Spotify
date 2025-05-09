from django.shortcuts import render
from .models import Order, PaymentMethod
from .serializers import OrderSerializer, PaymentMethodSerializer
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status, permissions

class OrderListCreateView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OrderRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.filter()
    serializer_class = OrderSerializer

    def destroy(self, request, *args, **kwargs):
        return Response({'detail': 'Xóa đơn hàng không được hỗ trợ'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

class PaymentMethodListCreateView(generics.ListCreateAPIView):
    queryset = PaymentMethod.objects.filter()
    serializer_class = PaymentMethodSerializer

class PaymentMethodRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PaymentMethod.objects.filter()
    serializer_class = PaymentMethodSerializer


class CheckSongPaidView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, song_id):
        has_paid = Order.objects.filter(user=request.user, song_id=song_id).exists()
        return Response({'has_paid': has_paid})