from django.urls import path

from . import views

urlpatterns = [
    path('api/v1/login/', views.LoginAPIView.as_view(), name='api_login'),
    path('api/v1/logout/', views.LogoutAPIView.as_view(), name='api_logout'),
    path('api/v1/protected/', views.ProtectedAPIView.as_view(), name='protected'),
]
