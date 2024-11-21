from django.db import models
from django.contrib.auth.models import User

class Candidate(models.Model):
    """
    Модель для хранения данных о кандидатах:
    - Имя, должность, контакты.
    - Статус (приглашён, принят и т.д.).
    - Даты создания и обновления записи.
    """
    name = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    status = models.CharField(max_length=50, choices=[
        ('invited', 'Invited'), # Приглашён
        ('accepted', 'Accepted'), # Принят
        ('rejected', 'Rejected'), # Отклонён
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Office(models.Model):
    """
    Модель для представления офисов:
    - Название, местоположение.
    - Квоты (общая и использованная).
    """
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    quota = models.PositiveIntegerField() # Общее количество квот, которое выделено офису.
    used_quota = models.PositiveIntegerField(default=0) # Количество уже использованных квот

    def __str__(self):
        return self.name


class Invitation(models.Model): 
    """
    Модель для хранения данных о приглашениях:
    - Ссылка на кандидата, офис и пользователя, отправившего приглашение.
    - Дата приглашения.
    """
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    office = models.ForeignKey(Office, on_delete=models.CASCADE)
    invited_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    date_invited = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Invitation for {self.candidate.name} to {self.office.name}"


class AdminUser(models.Model):
    """
    Расширение стандартной модели User для администраторов:
    - Содержит дополнительные поля, такие как права доступа.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    permissions = models.CharField(max_length=255)

    def __str__(self):
        return f'Admin: {self.user.username}'


class QuotaHistory(models.Model):
    """
    Модель для хранения истории изменений квот:
    - Ссылка на офис, изменение (положительное или отрицательное), дата и причина.
    """
    office = models.ForeignKey(Office, on_delete=models.CASCADE)
    change = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)
    reason = models.TextField()

    def __str__(self):
        return f"Quota change for {self.office.name}"


class Archive(models.Model):
    """
    Модель для хранения данных об архивированных кандидатах:
    - Ссылка на кандидата и офис, дата архивации и заметки.
    """
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    office = models.ForeignKey(Office, on_delete=models.CASCADE)
    date_archived = models.DateTimeField(auto_now_add=True)
    notes = models.TextField()

    def __str__(self):
        return f"Archived {self.candidate.name} for {self.office.name}"
