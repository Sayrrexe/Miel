from django.contrib.auth import get_user_model

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST

from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse


User = get_user_model()


# APIView для входа
class LoginAPIView(APIView):
    
    @extend_schema(
        summary="Авторизация пользователя",
        description=(
            "Позволяет пользователю авторизоваться, предоставив имя пользователя и пароль. "
            "Возвращает токен доступа, если учетные данные верны."
            "полученный токен нужно передавать в headers в поле Authorization в формате Token <token>"
        ),
        request={
            "application/json": {
                "username": "str",
                "password": "str",
            }
        },
        responses={
            200: OpenApiResponse(
                response={"token": "str"},
                description="Успешная авторизация. Возвращается токен доступа.",
            ),
            400: OpenApiResponse(
                response={"error": "str"},
                description="Ошибка запроса. Возможные причины: отсутствуют данные, неверные учетные данные или пользователь не найден.",
            ),
        },
        examples=[
            OpenApiExample(
                "Успешный запрос",
                value={"username": "testuser", "password": "testpassword"},
                request_only=True,
            ),
            OpenApiExample(
                "Успешный ответ",
                value={"token": "abc123xyz456"},
                response_only=True,
                status_codes=["200"],
            ),
            OpenApiExample(
                "Ошибка: отсутствуют данные",
                value={"error": "Username and password are required"},
                response_only=True,
                status_codes=["400"],
            ),
            OpenApiExample(
                "Ошибка: неверные учетные данные",
                value={"error": "Invalid credentials"},
                response_only=True,
                status_codes=["400"],
            ),
            OpenApiExample(
                "Ошибка: пользователь не найден",
                value={"error": "User not found"},
                response_only=True,
                status_codes=["400"],
            ),
        ],
    )
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

    @extend_schema(
        summary="Выход из системы",
        description="Удаляет токен текущего пользователя, завершая его сессию.",
        request=None,
        responses={
            200: OpenApiResponse(
                response={"message": "str"},
                description="Успешный выход из системы."
            )
        },
        examples=[
            OpenApiExample(
                "Успешный запрос",
                value={"message": "Logged out successfully"},
                response_only=True,
                status_codes=["200"]
            )
        ],
    )
    def post(self, request):
        request.user.auth_token.delete()  # Удаляем токен пользователя
        return Response({"message": "Logged out successfully"}, status=HTTP_200_OK)