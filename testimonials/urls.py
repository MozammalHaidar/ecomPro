from django.urls import path
from .views import (
    TestimonialListView,
    CreateTestimonialView,
    AdminTestimonialListView,
    AdminTestimonialApproveView,
    AdminTestimonialDeleteView,
)

urlpatterns = [
    path('', TestimonialListView.as_view(), name='testimonial-list'),
    path('submit/', CreateTestimonialView.as_view(), name='testimonial-create'),
    path('admin/', AdminTestimonialListView.as_view(), name='admin-testimonial-list'),
    path('admin/<int:pk>/approve/', AdminTestimonialApproveView.as_view(), name='admin-testimonial-approve'),
    path('admin/<int:pk>/delete/', AdminTestimonialDeleteView.as_view(), name='admin-testimonial-delete'),
]