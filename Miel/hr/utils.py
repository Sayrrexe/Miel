from django.db import transaction
from .models import Office, Transaction

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
