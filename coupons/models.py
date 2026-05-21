from django.db import models
from django.utils import timezone


class Coupon(models.Model):
    DISCOUNT_TYPE_CHOICES = [
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed Amount'),
    ]

    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES, default='percentage')
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    minimum_order = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    maximum_discount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    usage_limit = models.PositiveIntegerField(default=0)
    used_count = models.PositiveIntegerField(default=0)
    valid_from = models.DateTimeField(default=timezone.now)
    valid_to = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.code

    def is_valid(self):
        now = timezone.now()
        if not self.is_active:
            return False, 'Coupon is not active'
        if self.valid_to and now > self.valid_to:
            return False, 'Coupon has expired'
        if now < self.valid_from:
            return False, 'Coupon is not valid yet'
        if self.usage_limit > 0 and self.used_count >= self.usage_limit:
            return False, 'Coupon usage limit reached'
        return True, 'Valid'

    def calculate_discount(self, total):
        if self.discount_type == 'percentage':
            discount = total * (self.discount_value / 100)
            if self.maximum_discount:
                discount = min(discount, self.maximum_discount)
        else:
            discount = self.discount_value
        return min(discount, total)
