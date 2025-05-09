from django.urls import path
from .views import OrderListCreateView, OrderRetrieveUpdateDestroyView, PaymentMethodListCreateView, PaymentMethodRetrieveUpdateDestroyView, CheckSongPaidView

urlpatterns = [
    path('', OrderListCreateView.as_view(), name='order-list-create'),
    path('<int:pk>/', OrderRetrieveUpdateDestroyView.as_view(), name='order-retrieve-update-destroy'),
    path('payment-methods/', PaymentMethodListCreateView.as_view(), name='payment-method-list-create'),
    path('payment-methods/<int:pk>/', PaymentMethodRetrieveUpdateDestroyView.as_view(), name='payment-method-retrieve-update-destroy'),
    path('check-song-paid/<int:song_id>/', CheckSongPaidView.as_view(), name='check-song-paid'),
]
