from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Category, Product, Review
from .serializers import CategorySerializer, ProductSerializer, ProductListSerializer, ReviewSerializer
from .filters import ProductFilter
from rest_framework.views import APIView


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).select_related('category').prefetch_related('reviews')
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'featured', 'review']:
            return [AllowAny()] if self.action in ['list', 'retrieve', 'featured'] else [IsAuthenticated()]
        return [IsAdminUser()]

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured = Product.objects.filter(is_active=True, featured=True)
        serializer = ProductListSerializer(featured, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def review(self, request, slug=None):
        product = self.get_object()

        if Review.objects.filter(product=product, user=request.user).exists():
            return Response(
                {'error': 'You have already reviewed this product'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(product=product, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from .models import Category, Product, Review, Wishlist
from .serializers import CategorySerializer, ProductSerializer, ProductListSerializer, ReviewSerializer, WishlistSerializer


class WishlistView(generics.ListAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).select_related('product')


class WishlistToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        product = Product.objects.filter(slug=slug).first()
        if not product:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        wishlist_item = Wishlist.objects.filter(
            user=request.user,
            product=product
        ).first()

        if wishlist_item:
            wishlist_item.delete()
            return Response({'message': 'Removed from wishlist', 'wishlisted': False})
        else:
            Wishlist.objects.create(user=request.user, product=product)
            return Response({'message': 'Added to wishlist', 'wishlisted': True})