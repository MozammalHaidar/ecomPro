from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['name', 'image', 'price', 'quantity']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'full_name', 'status', 'total_price', 'is_paid', 'created_at']
    list_filter = ['status', 'is_paid']
    search_fields = ['user__email', 'full_name', 'email']
    list_editable = ['status']
    readonly_fields = ['total_price', 'is_paid', 'paid_at', 'created_at']
    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'name', 'price', 'quantity']
