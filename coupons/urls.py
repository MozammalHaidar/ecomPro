from django.urls import path
from .views import ValidateCouponView, AdminCouponListView, AdminCouponDetailView

urlpatterns = [
    path('validate/', ValidateCouponView.as_view(), name='validate-coupon'),
    path('admin/', AdminCouponListView.as_view(), name='admin-coupon-list'),
    path('admin/<int:pk>/', AdminCouponDetailView.as_view(), name='admin-coupon-detail'),
]