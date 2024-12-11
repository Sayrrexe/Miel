from rest_framework.permissions import BasePermission
from .models import Moderator, Supervisor

class IsModerator(BasePermission):
    """
    Разрешение только для модераторов.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            return Moderator.objects.filter(user=request.user).exists()
        except Moderator.DoesNotExist:
            return False
        
class IsSupervisor(BasePermission):
    """
    Разрешение только для модераторов.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            return Supervisor.objects.filter(user=request.user).exists()
        except Supervisor.DoesNotExist:
            return False
