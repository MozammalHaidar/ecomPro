from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import Testimonial
from .serializers import TestimonialSerializer, CreateTestimonialSerializer


class TestimonialListView(generics.ListAPIView):
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Testimonial.objects.filter(is_approved=True)


class CreateTestimonialView(generics.CreateAPIView):
    serializer_class = CreateTestimonialSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Thank you! Your review has been submitted for approval.'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminTestimonialListView(generics.ListAPIView):
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminUser]
    queryset = Testimonial.objects.all()

    
class AdminTestimonialApproveView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        testimonial = Testimonial.objects.filter(pk=pk).first()
        if not testimonial:
            return Response(
                {'error': 'Testimonial not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        testimonial.is_approved = not testimonial.is_approved
        testimonial.save()
        return Response({
            'message': f'Testimonial {"approved" if testimonial.is_approved else "unapproved"}',
            'is_approved': testimonial.is_approved
        })


class AdminTestimonialDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAdminUser]
    queryset = Testimonial.objects.all()
