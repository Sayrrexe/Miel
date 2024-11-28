from django.urls import path, include

from . import views

urlpatterns = [
    path('login/', views.LoginView, name='login'),
    # url стартовой страницы
    path('', include('django.contrib.auth.urls')),

]
