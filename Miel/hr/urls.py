from django.urls import path, include

from rest_framework.routers import DefaultRouter

from . import views


router = DefaultRouter()
router.register(r'todos', views.TodoViewSet, basename='todo') # CRUD для todo
router.register(r'supervisor/favorites', views.FavoriteViewSet, basename='favorite') # CRUD для добавление кандидатов в избранное
router.register(r'admin/supervisors', views.SupervisorViewSet)  # CRUD для рук-лей ( от лица админа )
router.register(r'admin/candidates', views.CandidateViewSet, basename='candidate') #CRUD для кандидатов ( От лица админа )

urlpatterns = [
    # подключение CRUD
    path('api/v1/', include(router.urls)),# для CRUD Api
    
    # Рук-ли
    path('api/v1/supervisor/candidates/', views.CandidateInfoView.as_view()), # список всех кандидатов
    path('api/v1/supervisor/info', views.GetSupervisorInfoView.as_view()), # выдаёт всю информацию по рук-лю
    path("api/v1/supervisor/invitations/", views.InvitationAPIView.as_view()), # приглашен боссом кандидатов
    path('api/v1/supervisor/info/quota', views.MonthlyStatisticView.as_view()),
    
    # Модераторы
    path('api/v1/todo-stats/', views.TodoStatsView.as_view(), name='todo-stats'),
    

    # index
    path('', views.index, name='index'),    
]
