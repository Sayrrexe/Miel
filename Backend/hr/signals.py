from django.core.exceptions import ValidationError
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from .models import ChatLink, QuotaRequest, Transaction, Office

@receiver(pre_save, sender=ChatLink)
def ensure_single_active_link(sender, instance, **kwargs):
    """
    Сигнал для проверки ссылки и удаления старых записей
    """
    # Проверяем, что ссылка начинается с 'https'
    if not instance.link.startswith('https'):
        raise ValidationError("Ссылка должна начинаться с 'https'")

    if not instance.pk or instance.is_active:
        ChatLink.objects.filter().exclude(pk=instance.pk).update(is_active=False)


@receiver(post_save, sender=Office)
def create_initial_transaction(sender, instance, created, **kwargs):
    if created:
        Transaction.objects.create(
            operation='add',
            cause="создание оффиса",
            office=instance,
            amount=instance.quota  # Используем количество квот
        )
    
@receiver(pre_save, sender=QuotaRequest)
def added_quota_to_office(sender, instance, **kwargs):
    '''
    Сигнал для добавления квот в случае принятия запроса
    '''

    if instance.pk: 
        try:
            previous = QuotaRequest.objects.get(pk=instance.pk)
        except QuotaRequest.DoesNotExist:
            return  

        if previous.status != "accepted" and instance.status == "accepted":
            office = instance.office 
            
            office.quota += instance.amount  # Добавляем квоту
            office.save()
            
            trans = Transaction.objects.create(operation = 'add', cause = f'Принятие запроса №{instance.id} на {instance.amount} квот', amount = instance.amount, office = office)
            trans.save()