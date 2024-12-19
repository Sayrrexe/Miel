from rest_framework.permissions import BasePermission
from .models import Administrator, Supervisor

class IsAdministrator(BasePermission):
    """
    Разрешение только для Администраторов.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            return Administrator.objects.filter(user=request.user).exists()
        except Administrator.DoesNotExist:
            return False
        
class IsSupervisor(BasePermission):
    """
    Разрешение только для администраторов.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            return Supervisor.objects.filter(user=request.user).exists()
        except Supervisor.DoesNotExist:
            return False
