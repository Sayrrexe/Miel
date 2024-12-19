from django.db import transaction
from django.utils.timezone import now

from datetime import timedelta
from .models import Candidate, Invitation, Office, Transaction



def write_off_the_quota(office_id, amount, cause):
    """
    Проверяет наличие квот у офиса, создаёт транзакцию и увеличивает used_quota.

    Args:
        office_id (int): ID офиса, для которого выполняется операция.
        amount (int): Количество квот для операции.
        cause (str): причина

    Returns:
        bool: True, если операция выполнена успешно, иначе False.
    """
    try:
        with transaction.atomic():  # Используем atomic для целостности операции
            office = Office.objects.select_for_update().get(id=office_id)

            # Проверка доступности квот
            if office.available_quota() < amount:
                return False, 'Not enough quota'

            # Обновление квот
            office.used_quota += amount
            office.save()

            # Создание транзакции
            Transaction.objects.create(
                operation='subtract',
                cause=cause,
                office=office,
                amount=amount
            )
        return True, ''
    except Office.DoesNotExist:
        return False, 'Office doesn`t exist'
    
    
def update_all_candidate_statuses(candidate_id, invitation_id):
    try:
        with transaction.atomic():  # Используем atomic для целостности операции
            # Получаем необходимые объекты
            candidate = Candidate.objects.select_for_update().get(id=candidate_id)
            selected_invitation = Invitation.objects.get(id=invitation_id)
            office = selected_invitation.office

            # Закрываем остальные приглашения за текущий месяц
            start_of_month = now().replace(day=1)
            end_of_month = (start_of_month + timedelta(days=32)).replace(day=1) - timedelta(seconds=1)

            invitations_to_reject = Invitation.objects.filter(
                candidate=candidate,
                created_at__range=(start_of_month, end_of_month)
            ).exclude(id=invitation_id)

            invitations_to_reject.update(status='rejected')

            # Обновляем данные кандидата
            candidate.is_free = False
            candidate.office = office
            candidate.is_archive = False
            candidate.save()

            # Обновляем выбранное приглашение, если нужно
            selected_invitation.status = 'accepted'
            selected_invitation.save()

        return True, 'Статус успешно обновлён'
    except Office.DoesNotExist:
        return False, 'Office doesn`t exist'
    except Candidate.DoesNotExist:
        return False, 'Candidate doesn`t exist'
    except Invitation.DoesNotExist:
        return False, 'Invitation doesn`t exist'
    except Exception as e:
        return False, f'Unexpected error: {str(e)}'
    
    
def update_one_status(invitation_id, status):
    try:
        with transaction.atomic():  
            selected_invitation = Invitation.objects.get(id=invitation_id)
            print(selected_invitation)

            selected_invitation.status = status
            selected_invitation.save()

        return True, 'Статус успешно обновлён'
    except Invitation.DoesNotExist:
        return False, 'Invitation doesn`t exist'
    except Exception as e:
        return False, f'Unexpected error: {str(e)}'


def restore_archived_candidates(candidate_ids):
    try:
        with transaction.atomic():
            candidates = Candidate.objects.filter(id__in=candidate_ids)
            if not candidates.exists():
                return False, "Кандидаты с указанными ID не найдены или уже восстановлены."

            # Восстанавливаем кандидатов
            candidates.update(is_archive=True)
            return True, f"Восстановлено кандидатов: {candidates.count()}"
    except Exception as e:
        return False, f"Произошла ошибка: {str(e)}"
