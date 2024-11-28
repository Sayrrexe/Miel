from django.urls import path, include

from . import views

urlpatterns = [
    path('', views.index, name='dashboard'),
    # -- Страницы Рук-ля
    path('dashboard', views.dashboard, name='dashboard'),
    path('supervisor/profile', views.supervisor_lk, name='supervisor_profile'),

    # -- Страницы модератора
    path('moderator/dashboard', views.moderator_dashboard, name='moderator_dashboard'),
    path('moderator/archive', views.moderator_acrhive, name='moderator_archive'),  # TODO
    path('moderator/offices/list', views.moderator_offices_list, name='moderator_offices'),
    path('moderator/office/add', views.moderator_office_add, name='moderator_office_add'),
    path('moderator/office/delete', views.moderator_office_delete, name='moderator_office_delete'),
    path('moderator/office/edit', views.moderator_office_edit, name='moderator_office_edit'),
    path('moderator/supervisors/list', views.moderator_supervisors_list, name='supervisors_list'),
    path('moderator/supervisor/add', views.moderator_supervisor_add, name='supervisor_add'),
    path('moderator/supervisor/delete', views.moderator_supervisor_delete,
         name='supervisor_delete'),
    path('moderator/supervisor/edit', views.moderator_supervisor_edit, name='supervisor_edit'),
    path('moderator/candidates/list', views.moderator_candidates_list, name='candidates_list'),
    path('moderator/candidate/add', views.moderator_candidate_add, name='candidate_add'),
    path('moderator/candidate/delete', views.moderator_candidate_delete, name='candidate_delete'),
    path('moderator/candidate/edit', views.moderator_candidate_edit, name='candidate_edit'),
    path('moderator/lk', views.moderator_lk, name='moderator_lk'),
    path('moderator/statistics', views.moderator_statistics, name='moderator_statistics'),
    path('moderator/quotes', views.moderator_quotes, name='moderator_quotes'),

]
