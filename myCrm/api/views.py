from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer , RecordSerializer
from rest_framework.permissions import AllowAny , IsAuthenticated
from .models import Record
from rest_framework import serializers
from rest_framework.response import Response
from django.contrib.auth import logout


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class LogoutView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"})

class RecordList(generics.ListCreateAPIView):
    serializer_class = RecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Record.objects.all()
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            raise serializers.ValidationError("Invalid data")

class RecordRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Record.objects.all()