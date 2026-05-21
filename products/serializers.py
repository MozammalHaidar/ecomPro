from rest_framework import serializers
from .models import Category, Product, Review, Wishlist, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'description', 'product_count']

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ReviewSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'user_email', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user_email', 'created_at']

    def get_user_email(self, obj):
        return obj.user.email

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.ReadOnlyField()
    final_price = serializers.ReadOnlyField()
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_name', 'name', 'slug',
            'description', 'price', 'discount_price', 'final_price',
            'image', 'images', 'stock', 'is_active', 'featured',
            'average_rating', 'reviews', 'created_at'
        ]
        read_only_fields = ['images']

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None
    



class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    average_rating = serializers.ReadOnlyField()
    final_price = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_name', 'name', 'slug',
            'price', 'discount_price', 'final_price',
            'image', 'stock', 'is_active', 'featured',
            'average_rating', 'created_at'
        ]

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None
    
class WishlistSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'created_at']
        read_only_fields = ['id', 'created_at']