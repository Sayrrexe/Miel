from django.contrib.auth import authenticate, login, logout, get_user_model
from django.shortcuts import render, redirect
from django.views import View
from django.contrib import messages
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST


User = get_user_model()


# APIView для входа
class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Username and password are required"},
                            status=HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                # Создаем или получаем токен
                token, created = Token.objects.get_or_create(user=user)
                return Response({"token": token.key}, status=HTTP_200_OK)
            else:
                return Response({"error": "Invalid credentials"}, status=HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=HTTP_400_BAD_REQUEST)


# APIView для выхода
class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()  # Удаляем токен пользователя
        return Response({"message": "Logged out successfully"}, status=HTTP_200_OK)


# проверка
class ProtectedAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": f"Привет, {request.user.username}!"}, status=HTTP_200_OK)
