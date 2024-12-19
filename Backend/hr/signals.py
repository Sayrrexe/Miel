from django.core.exceptions import ValidationError
from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import ChatLink

@receiver(pre_save, sender=ChatLink)
def ensure_single_active_link(sender, instance, **kwargs):
    """
    Сигнал для проверки ссылки и удаления старых записей
    """
    # Проверяем, что ссылка начинается с 'https'
    if not instance.link.startswith('https'):
        raise ValidationError("Ссылка должна начинаться с 'https'")

    # Удаляем старые записи для данного пользователя и платформы
    ChatLink.objects.filter(user=instance.user, platform=instance.platform).delete()
