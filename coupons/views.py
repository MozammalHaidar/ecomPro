from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .models import Coupon
from .serializers import CouponSerializer, ValidateCouponSerializer


class ValidateCouponView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ValidateCouponSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        code = serializer.validated_data['code'].upper()
        order_total = serializer.validated_data['order_total']

        coupon = Coupon.objects.filter(code=code).first()
        if not coupon:
            return Response(
                {'error': 'Invalid coupon code'},
                status=status.HTTP_404_NOT_FOUND
            )

        is_valid, message = coupon.is_valid()
        if not is_valid:
            return Response(
                {'error': message},
                status=status.HTTP_400_BAD_REQUEST
            )

        if order_total < coupon.minimum_order:
            return Response(
                {'error': f'Minimum order amount is ${coupon.minimum_order}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        discount = coupon.calculate_discount(order_total)
        final_total = order_total - discount

        return Response({
            'code': coupon.code,
            'description': coupon.description,
            'discount_type': coupon.discount_type,
            'discount_value': float(coupon.discount_value),
            'discount_amount': float(discount),
            'final_total': float(final_total),
            'minimum_order': float(coupon.minimum_order),
        })


# Admin Views
class AdminCouponListView(generics.ListCreateAPIView):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [IsAdminUser]


class AdminCouponDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [IsAdminUser]
