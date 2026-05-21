from rest_framework import serializers
from .models import Testimonial


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = [
            'id', 'name', 'location', 'rating',
            'comment', 'avatar_letter', 'created_at'
        ]


class CreateTestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['name', 'location', 'email', 'rating', 'comment']