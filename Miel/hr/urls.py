from django.urls import path, include

from rest_framework.routers import DefaultRouter

from . import views


router = DefaultRouter()
router.register(r'todos', views.TodoViewSet, basename='todo') # CRUD для todo
router.register(r'favorites', views.FavoriteViewSet, basename='favorite') # CRUD для добавление кандидатов в избранное
router.register(r'supervisors', views.SupervisorViewSet)  # CRUD для рук-лей ( от лица админа )

urlpatterns = [
    # подключение CRUD
    path('api/v1/', include(router.urls)),# для Api
    # Рук-ли
    path('api/v1/supervisors/', views.GetSupervisorInfoView.as_view()), # выдаёт всю информацию по рук-лю
    path("api/v1/invitations/", views.InvitationAPIView.as_view()), # приглашен боссом кандидатов
    
    # Модераторы
    path('api/v1/todo-stats/', views.TodoStatsView.as_view(), name='todo-stats'),
    

    # index
    path('', views.index, name='index'),    
]
