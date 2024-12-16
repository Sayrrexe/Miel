from django.contrib import admin
from django.contrib.auth.hashers import make_password
from .models import (
    CustomUser,
    Supervisor,
    Administrator,
    Candidate,
    Office,
    Favorite,
    Todo,
    Invitation,
    Transaction,
)

class CustomUserAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        if 'password' in form.changed_data:
            obj.password = make_password(obj.password)  
        
        if not obj.is_active:
            obj.is_active = True  
        
        super().save_model(request, obj, form, change)

# Регистрируем CustomUser с кастомным классом админки
admin.site.register(CustomUser, CustomUserAdmin)

# Регистрируем остальные модели
admin.site.register(Supervisor)
admin.site.register(Administrator)
admin.site.register(Candidate)
admin.site.register(Office)
admin.site.register(Favorite)
admin.site.register(Todo)
admin.site.register(Invitation)
admin.site.register(Transaction)
