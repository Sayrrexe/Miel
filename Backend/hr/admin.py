from django.contrib import admin
from django.contrib.auth.hashers import make_password
from unfold.admin import ModelAdmin
from .models import (
    ChatLink,
    CustomUser,
    QuotaRequest,
    Supervisor,
    Administrator,
    Candidate,
    Office,
    Favorite,
    Todo,
    Invitation,
    Transaction,
)

class CustomUserAdmin(ModelAdmin):
    list_display = ("id", "username", "email", "is_active", "is_staff", "date_joined")
    list_filter = ("is_active", "is_staff", "date_joined")
    search_fields = ("username", "email", "phone")
    ordering = ("id",)
    readonly_fields = ("date_joined", "last_login")
    actions = ["activate_users", "deactivate_users"]

    def save_model(self, request, obj, form, change):
        if "password" in form.changed_data:
            obj.password = make_password(obj.password)
        super().save_model(request, obj, form, change)

    @admin.action(description="Активировать выбранных пользователей")
    def activate_users(self, request, queryset):
        queryset.update(is_active=True)

    @admin.action(description="Деактивировать выбранных пользователей")
    def deactivate_users(self, request, queryset):
        queryset.update(is_active=False)

class CandidateAdmin(ModelAdmin):
    list_display = (
        "id",
        "name",
        "surname",
        "email",
        "phone",
        "is_free",
        "created_at",
    )
    list_filter = ("is_free", "created_at")
    search_fields = ("name", "surname", "email", "phone")
    ordering = ("created_at",)
    actions = ["archive_candidates"]

    @admin.action(description="Архивировать выбранных кандидатов")
    def archive_candidates(self, request, queryset):
        queryset.update(is_archive=True)

class OfficeAdmin(ModelAdmin):
    list_display = ("id", "name", "location", "quota", "used_quota", "get_available_quota")
    search_fields = ("name", "location", "phone")
    actions = ["reset_quota"]
    
    def get_available_quota(self, obj):
        return obj.available_quota()
    get_available_quota.short_description = 'свободная квота'

    @admin.action(description="Сбросить квоты")
    def reset_quota(self, request, queryset):
        for office in queryset:
            office.reset_quota()


class TodoAdmin(ModelAdmin):
    list_display = (
        "id",
        "user",
        "task",
        "due_date",
        "is_complete",
        "is_visible",
        "created_at",
    )
    list_filter = ("is_complete", "is_visible", "created_at")
    search_fields = ("task", "user__username")
    ordering = ("due_date",)
    actions = ["mark_as_complete"]

    @admin.action(description="Отметить задачи как выполненные")
    def mark_as_complete(self, request, queryset):
        queryset.update(is_complete=True, is_visible=False)

class AdminsAdmin(ModelAdmin):
    list_display = ("id", "get_first_name", "get_last_name", "get_username", "get_date_joined")
    search_fields = ("user__username", 'user__first_name', 'user__last_name')
    ordering = ("-id",)
    
    
    def get_first_name(self, obj):
        return obj.user.first_name
    get_first_name.short_description = "Имя"

    def get_last_name(self, obj):
        return obj.user.last_name
    get_last_name.short_description = "Фамилия"

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = "Логин"

    def get_date_joined(self, obj):
        return obj.user.date_joined.strftime("%d %B %Y г. %H:%M")
    get_date_joined.short_description = "Дата регистрации"

class SupervisorsAdmin(ModelAdmin):
    list_display = (
        "id",
        "user__first_name",
        "user__last_name",
        "office",
        "department",
        "created_at",
    )
    search_fields = ("user__username", "user__first_name", "user__last_name")
    ordering = ("-id",)
    readonly_fields = ("created_at", "updated_at")

class InvitationsAdmin(ModelAdmin):
    list_filter = ("status", "created_at")
    list_display = (
        "id",
        "get_full_name",
        "get_office_name",
        "status",
        "created_at",
    )
    search_fields = ("candidate__name", "candidate__surname",)
    ordering = ("-id",)
    readonly_fields = ("created_at", "updated_at")
    
    def get_full_name(self, obj):
        candidate = obj.candidate
        full_name = f'{candidate.surname} {candidate.name}' 
        return full_name
    get_full_name.short_description = "кандидат"
    
    def get_office_name(self,obj):
        return obj.office.name
    get_office_name.short_description = "оффис"
    
class TransactionsAdmin(ModelAdmin):
    list_filter = ('operation', 'amount', 'office__name','created_at', )
    list_display = ('id', 'operation', 'amount', 'cause', 'office__name','created_at')
    search_fields = ('cause', 'office__name')
    ordering = ('-id',)
    readonly_fields = ("created_at", "updated_at")
    
class ChatLinkAdmin(ModelAdmin):
    list_display = ('id', 'user__username','platform','link','is_active','created_at')
    readonly_fields = ("created_at", "updated_at")
    
class FavoritesAdmin(ModelAdmin):
    list_display = ('id', 'user__username','get_full_name')
    
    def get_full_name(self, obj):
        candidate = obj.candidate
        full_name = f'{candidate.surname} {candidate.name}' 
        return full_name
    get_full_name.short_description = "кандидат"
    
class QuotaRequestsAdmin(ModelAdmin):
    list_filter = ('office__name', 'status','created_at', 'updated_at')
    list_display = ('id', 'office__name','amount', 'status', 'updated_at')
    search_fields = ('amount','office__name')
    readonly_fields = ("created_at", "updated_at")
    ordering = ('-id',)
    
        

# Регистрация моделей
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Candidate, CandidateAdmin)
admin.site.register(Office, OfficeAdmin)
admin.site.register(Todo, TodoAdmin)
admin.site.register(Administrator, AdminsAdmin)
admin.site.register(Supervisor, AdminsAdmin)
admin.site.register(Invitation, InvitationsAdmin)
admin.site.register(Transaction, TransactionsAdmin)
admin.site.register(ChatLink, ChatLinkAdmin)
admin.site.register(Favorite, FavoritesAdmin)
admin.site.register(QuotaRequest, QuotaRequestsAdmin)
