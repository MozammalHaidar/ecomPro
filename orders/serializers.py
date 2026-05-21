from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'name', 'image', 'price', 'quantity']
        read_only_fields = ['id']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'status', 'total_price',
            'full_name', 'email', 'phone',
            'address', 'city', 'postal_code', 'country',
            'is_paid', 'paid_at', 'payment_method',
            'items', 'created_at'
        ]
        read_only_fields = ['id', 'status', 'total_price', 'is_paid', 'paid_at', 'created_at']


class CreateOrderSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    address = serializers.CharField()
    city = serializers.CharField(max_length=100)
    postal_code = serializers.CharField(max_length=20)
    country = serializers.CharField(max_length=100)
    items = serializers.ListField(child=serializers.DictField())

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError('Order must have at least one item')
        return items