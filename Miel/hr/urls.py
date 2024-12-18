from django.urls import path, include

from rest_framework.routers import DefaultRouter

from . import views


router = DefaultRouter()
router.register(r'todos', views.TodoViewSet, basename='todo') # CRUD для todo
router.register(r'supervisor/favorites', views.FavoriteViewSet, basename='favorite') # CRUD для добавление кандидатов в избранное
router.register(r'admin/supervisors', views.SupervisorViewSet)  # CRUD для рук-лей ( от лица админа )
router.register(r'admin/candidates', views.CandidateViewSet, basename='candidate')
router.register(r'admin/offices', views.OfficeViewSet, basename='office')#CRUD для офисов ( От лица админа )

urlpatterns = [
    # подключение CRUD
    path('api/', include(router.urls)),# для CRUD Api
    path('api/info/', views.GetUserInfoView.as_view()), # выдаёт всю информацию о пользователе
    
    
    # Рук-ли
    path('api/supervisor/candidates/', views.CandidateInfoView.as_view()), # список всех кандидатов
    path("api/supervisor/invitations/", views.InvitationAPIView.as_view()), # приглашен боссом кандидатов
    path('api/supervisor/info/quota/', views.MonthlyStatisticView.as_view()),
    
    
    # Администратор
    path('api/todo-stats/', views.TodoStatsView.as_view(), name='todo-stats'),
    path('api/statistic/invitions/', views.InvitationStatisticsViewSet.as_view(), name='invitions-stats'),
    path('api/admin/candidates/<int:id>/invitations/', views.CandidateInvitationsView.as_view(), name='candidate-invitations'),
    path('api/admin/candidates/<int:candidate_id>/invitations/<int:invitation_id>/', views.CandidateInvitationUpdateView.as_view(), name='candidate-invitation-update'),
    

    # index
    path('', views.index, name='index'),    
]
