from django.urls import path, include

from . import views

from rest_framework.routers import DefaultRouter
from .views import FavoriteViewSet, TodoViewSet

router = DefaultRouter()
router.register(r'todos', TodoViewSet, basename='todo') # CRUD для todo
router.register(r'favorites', FavoriteViewSet, basename='favorite') # CRUD для добавление кандидатов в избранное

urlpatterns = [
    # подключение CRUD
    path('api/v1/', include(router.urls)),# для Api
    # Рук-ли
    path('api/v1/supervisors/', views.GetSupervisorInfoView.as_view()), # выдаёт всю информацию по рук-лю
    path('api/v1/candidates/', views.CandidateInfoView.as_view()), # выдаёт кандидатов от лица босса, только просмотр
    path("api/v1/invitations/", views.InvitationAPIView.as_view()), # приглашен боссом кандидатов
    
    # Модераторы

    #.

    # index
    path('', views.index, name='index'),    
]
