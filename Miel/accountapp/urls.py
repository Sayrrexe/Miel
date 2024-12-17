from django.urls import path

from . import views

urlpatterns = [
    path('api/login/', views.LoginAPIView.as_view(), name='api_login'),
    path('api/logout/', views.LogoutAPIView.as_view(), name='api_logout'),
    path('api/protected/', views.ProtectedAPIView.as_view(), name='protected'),
]
