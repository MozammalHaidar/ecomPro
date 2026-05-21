from django.contrib import admin

from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'rating', 'is_approved', 'created_at']
    list_filter = ['is_approved', 'rating']
    search_fields = ['name', 'email', 'comment']
    list_editable = ['is_approved']
    readonly_fields = ['avatar_letter', 'created_at']
