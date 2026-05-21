from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Subscriber
from .serializers import SubscriberSerializer


class SubscribeView(APIView):
    def post(self, request):
        serializer = SubscriberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Successfully subscribed to newsletter!'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UnsubscribeView(APIView):
    def post(self, request):
        email = request.data.get('email')
        subscriber = Subscriber.objects.filter(email=email).first()
        if subscriber:
            subscriber.is_active = False
            subscriber.save()
            return Response({'message': 'Successfully unsubscribed'})
        return Response(
            {'error': 'Email not found'},
            status=status.HTTP_404_NOT_FOUND
        )
