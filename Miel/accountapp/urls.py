from django.urls import path, include

from . import views


urlpatterns = [

    # url стартовой страницы
    path('', include('django.contrib.auth.urls')),

]