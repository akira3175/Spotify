from django.contrib import admin
from .models import Order, PaymentMethod

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'song', 'payment_method', 'price', 'date_buy')
    list_filter = ('payment_method', 'user')
    search_fields = ('user__username', 'song__title')
    list_per_page = 10

@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)
    list_per_page = 10


