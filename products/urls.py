
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, WishlistView, WishlistToggleView

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('', ProductViewSet, basename='product')

urlpatterns = [
    path('wishlist/', WishlistView.as_view(), name='wishlist'),
    path('<slug:slug>/wishlist/', WishlistToggleView.as_view(), name='wishlist-toggle'),
    path('', include(router.urls)),
]