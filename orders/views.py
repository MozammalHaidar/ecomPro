from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils import timezone
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer
from products.models import Product


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all().prefetch_related('items')
        return Order.objects.filter(user=user).prefetch_related('items')


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=user)


class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        items_data = data.pop('items')
        coupon_code = request.data.get('coupon_code', '').upper()

        # Create order
        order = Order.objects.create(user=request.user, **data)

        # Create order items
        for item in items_data:
            product = Product.objects.filter(id=item.get('product_id')).first()
            if not product:
                order.delete()
                return Response({'error': 'Product not found'}, status=status.HTTP_400_BAD_REQUEST)

            if product.stock < int(item.get('quantity', 1)):
                order.delete()
                return Response({'error': f'{product.name} is out of stock'}, status=status.HTTP_400_BAD_REQUEST)

            OrderItem.objects.create(
                order=order,
                product=product,
                name=product.name,
                image=str(product.image) if product.image else '',
                price=product.final_price,
                quantity=item.get('quantity', 1),
            )

            # Reduce stock
            product.stock -= int(item.get('quantity', 1))
            product.save()

        order.calculate_total()

        # Apply coupon
        if coupon_code:
            from coupons.models import Coupon
            coupon = Coupon.objects.filter(code=coupon_code).first()
            if coupon:
                is_valid, message = coupon.is_valid()
                if is_valid and order.total_price >= coupon.minimum_order:
                    discount = coupon.calculate_discount(order.total_price)
                    order.total_price -= discount
                    order.save()
                    coupon.used_count += 1
                    coupon.save()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class UpdateOrderStatusView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        order = Order.objects.filter(pk=pk).first()
        if not order:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        order.status = new_status
        if new_status == 'delivered':
            order.is_paid = True
            order.paid_at = timezone.now()
        order.save()

        return Response(OrderSerializer(order).data)


class CancelOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        order = Order.objects.filter(pk=pk, user=request.user).first()
        if not order:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        if order.status != 'pending':
            return Response({'error': 'Only pending orders can be cancelled'}, status=status.HTTP_400_BAD_REQUEST)

        # Restore stock
        for item in order.items.all():
            if item.product:
                item.product.stock += item.quantity
                item.product.save()

        order.status = 'cancelled'
        order.save()

        return Response({'message': 'Order cancelled successfully'})
    

class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        from django.contrib.auth import get_user_model
        User = get_user_model()

        total_orders = Order.objects.count()
        total_revenue = sum(
            o.total_price for o in Order.objects.filter(is_paid=True)
        )
        total_products = Product.objects.count()
        total_users = User.objects.count()
        pending_orders = Order.objects.filter(status='pending').count()
        recent_orders = Order.objects.order_by('-created_at')[:5]

        return Response({
            'total_orders': total_orders,
            'total_revenue': float(total_revenue),
            'total_products': total_products,
            'total_users': total_users,
            'pending_orders': pending_orders,
            'recent_orders': OrderSerializer(recent_orders, many=True).data,
        })

class SalesChartView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        from django.db.models import Sum, Count
        from django.db.models.functions import TruncMonth, TruncDay
        from django.utils import timezone
        import datetime

        period = request.query_params.get('period', 'monthly')

        if period == 'daily':
            # Last 30 days
            start_date = timezone.now() - datetime.timedelta(days=30)
            sales = Order.objects.filter(
                created_at__gte=start_date,
            ).annotate(
                date=TruncDay('created_at')
            ).values('date').annotate(
                revenue=Sum('total_price'),
                orders=Count('id')
            ).order_by('date')

            data = [
                {
                    'date': item['date'].strftime('%d %b'),
                    'revenue': float(item['revenue'] or 0),
                    'orders': item['orders'],
                }
                for item in sales
            ]

        else:
            # Last 12 months
            start_date = timezone.now() - datetime.timedelta(days=365)
            sales = Order.objects.filter(
                created_at__gte=start_date,
            ).annotate(
                date=TruncMonth('created_at')
            ).values('date').annotate(
                revenue=Sum('total_price'),
                orders=Count('id')
            ).order_by('date')

            data = [
                {
                    'date': item['date'].strftime('%b %Y'),
                    'revenue': float(item['revenue'] or 0),
                    'orders': item['orders'],
                }
                for item in sales
            ]

        # Top selling products
        from django.db.models import Sum
        top_products = OrderItem.objects.values(
            'name'
        ).annotate(
            total_sold=Sum('quantity'),
            total_revenue=Sum('price')
        ).order_by('-total_sold')[:5]

        top_products_data = [
            {
                'name': item['name'],
                'total_sold': item['total_sold'],
                'total_revenue': float(item['total_revenue'] or 0),
            }
            for item in top_products
        ]

        # Order status breakdown
        status_data = Order.objects.values('status').annotate(
            count=Count('id')
        ).order_by('status')

        status_breakdown = [
            {
                'status': item['status'],
                'count': item['count'],
            }
            for item in status_data
        ]

        return Response({
            'sales_data': data,
            'top_products': top_products_data,
            'status_breakdown': status_breakdown,
        })