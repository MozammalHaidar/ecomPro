from rest_framework import serializers
from .models import Coupon


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = [
            'id', 'code', 'description', 'discount_type',
            'discount_value', 'minimum_order', 'maximum_discount',
            'is_active', 'usage_limit', 'used_count',
            'valid_from', 'valid_to', 'created_at'
        ]
        read_only_fields = ['id', 'used_count', 'created_at']


class ValidateCouponSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=50)
    order_total = serializers.DecimalField(max_digits=10, decimal_places=2)