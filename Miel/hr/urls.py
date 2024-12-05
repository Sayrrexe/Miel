from django.urls import path, include

from . import views

from rest_framework.routers import DefaultRouter
from .views import TodoViewSet
router = DefaultRouter()
router.register(r'todos', TodoViewSet, basename='todo')

urlpatterns = [
    # Главная страница
    path('', views.index, name='index'),

    # -- Страницы Руководителя
    path('dashboard', views.dashboard, name='dashboard'),  # Дашборд
    path('supervisor/profile', views.supervisor_lk, name='supervisor_profile'),  # Профиль

    # -- Страницы Модератора
    # Дашборд и Личный кабинет
    path('moderator/dashboard', views.moderator_dashboard, name='moderator_dashboard'),  # Дашборд модератора
    path('moderator/lk', views.moderator_lk, name='moderator_lk'),  # Личный кабинет модератора

    # Статистика и цитаты
    path('moderator/statistics', views.moderator_statistics, name='moderator_statistics'),  # Статистика
    path('moderator/quotes', views.moderator_quotes, name='moderator_quotes'),  # Цитаты

    # -- Офисы
    path('moderator/offices/list', views.moderator_offices_list, name='moderator_offices'),  # Список офисов
    path('moderator/office/add', views.moderator_office_add, name='moderator_office_add'),  # Добавление офиса
    path('moderator/office/delete', views.moderator_office_delete, name='moderator_office_delete'),  # Удаление офиса
    path('moderator/office/edit', views.moderator_office_edit, name='moderator_office_edit'),  # Редактирование офиса




    # -- Руководители
    path('moderator/supervisors/list', views.moderator_supervisors_list, name='supervisors_list'),  # Список руководителей
    path('moderator/supervisor/add', views.moderator_supervisor_add, name='supervisor_add'),  # Добавление руководителя
    path('moderator/supervisor/delete', views.moderator_supervisor_delete, name='supervisor_delete'),  # Удаление руководителя
    path('moderator/supervisor/edit', views.moderator_supervisor_edit, name='supervisor_edit'),  # Редактирование руководителя

    # -- Кандидаты
    path('moderator/candidates/list', views.moderator_candidates_list, name='candidates_list'),  # Список кандидатов
    path('moderator/candidate/add', views.moderator_candidate_add, name='candidate_add'),  # Добавление кандидата
    path('moderator/candidate/delete', views.moderator_candidate_delete, name='candidate_delete'),  # Удаление кандидата
    path('moderator/candidate/edit', views.moderator_candidate_edit, name='candidate_edit'),  # Редактирование кандидата


    # api
    path('api/v1/supervisors/', views.GetSupervisorInfoView.as_view()),
    path('api/v1/candidates/', views.CandidateInfoView.as_view()),
    path("api/v1/invitations", views.InvitationAPIView.as_view()),
    path('api/v1/', include(router.urls)), # для Api
]
