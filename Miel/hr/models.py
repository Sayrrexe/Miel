from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

from datetime import date, timedelta


class CustomUser(AbstractUser):
    patronymic = models.CharField(max_length=32, verbose_name='Отчество', null=True, blank=True)
    phone = models.CharField(max_length=15, verbose_name="Номер телефона", blank=True, null=True)
    
    def get_full_name(self):
        return f'{self.last_name} {self.first_name} {self.patronymic}'


class Moderator(models.Model):
    """
    Расширение стандартной модели User для администраторов:
    - Содержит дополнительные поля, такие как права доступа.
    """
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return f'Admin: {self.user.username}'
    
    class Meta:
        verbose_name = "Модератор"
        verbose_name_plural = "Модераторы"
        unique_together = (('user'),)


class Candidate(models.Model):
    """
    Кандидат, который может быть привязан к офису, иметь различные курсы и выполнять проекты.
    
    Поля:
        is_active (bool): Указывает, активен ли кандидат (по умолчанию True).
        name (str): Имя кандидата (максимальная длина: 16 символов).
        surname (str): Фамилия кандидата (максимальная длина: 64 символа).
        patronymic (str, optional): Отчество кандидата (максимальная длина: 32 символа).
        birth (date, optional): Дата рождения кандидата.
        education (str): Образование кандидата (максимальная длина: 128 символов).
        photo (str, optional): Ссылка на фотографию кандидата (максимальная длина: 128 символов).
        country (str): Страна проживания кандидата (по умолчанию: "Россия").
        city (str): Город проживания кандидата.
        email (str, optional): Электронная почта кандидата.
        phone (str): Телефон кандидата (максимальная длина: 16 символов).
        resume (str): Ссылка на резюме кандидата (максимальная длина: 128 символов).
        is_free (bool): Указывает, доступен ли кандидат для работы (по умолчанию True).
        office (ForeignKey, optional): Офис, к которому привязан кандидат.
            * Если `is_free` = False, это поле обязательно.
            * Если `is_free` = True, это поле должно быть пустым.
        course_rieltor_join (str): Статус курса "Введение в профессию риэлтор".
        basic_legal_course (str): Статус "Базовый юридический курс".
        course_mortgage (str): Статус курса "Ипотека".
        course_taxation (str): Статус курса "Налогообложение".
        completed_objects (int): Количество выполненных проектов.
        clients (int): Количество обслуженных клиентов.
        created_at (datetime): Дата и время создания записи (устанавливается автоматически).
        updated_at (datetime): Дата и время последнего обновления записи (обновляется автоматически).
    """

    is_active = models.BooleanField(default=True)
    name = models.CharField(max_length=16)
    surname = models.CharField(max_length=64)
    patronymic = models.CharField(max_length=32, null=True, blank=True)
    birth = models.DateField(null=True, blank=True)
    education = models.CharField(max_length=128, null=True, blank=True)
    photo = models.CharField(max_length=128, null=True, blank=True)

    country = models.CharField(max_length=32, default="Россия")
    city = models.CharField(max_length=32)

    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=16)
    resume = models.CharField(max_length=128)

    is_free = models.BooleanField(default=True)
    office = models.ForeignKey(
        "hr.Office",
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    course_rieltor_join = models.CharField(
        max_length=16,
        choices=[
            ("in_progress", "В процессе"),
            ("completed", "Сдан"),
            ("not_started", "Не сдан"),
        ],
        default="completed",
        verbose_name="Введение в профессию риэлтор"
    )
    basic_legal_course = models.CharField(
        max_length=16,
        choices=[
            ("in_progress", "В процессе"),
            ("completed", "Сдан"),
            ("not_started", "Не начат"),
        ],
        default="not_started",
        verbose_name="Базовый юридический курс"
    )
    course_mortgage = models.CharField(
        max_length=16,
        choices=[
            ("in_progress", "В процессе"),
            ("completed", "Сдан"),
            ("not_started", "Не начат"),
        ],
        default="not_started",
        verbose_name='Курс "ипотека"'
    )
    course_taxation = models.CharField(
        max_length=16,
        choices=[
            ("in_progress", "В процессе"),
            ("completed", "Сдан"),
            ("not_started", "Не начат"),
        ],
        default="not_started",
        verbose_name='Курс "налогообложение"'
    )

    completed_objects = models.PositiveIntegerField(default=0, verbose_name="Объекты")
    clients = models.PositiveIntegerField(default=0, verbose_name="клиенты")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} {self.surname}"

    def calculate_age(self):
        """Расчёт возраста кандидата на основе даты рождения."""
        if self.birth:
            today = date.today()
            return today.year - self.birth.year - ((today.month, today.day) < (self.birth.month, self.birth.day))
        return None  # Возраст неизвестен, если нет даты рождения

    def save(self, *args, **kwargs):

        if self.is_free:
            self.office = None

        elif not self.is_free and self.office is None:
            raise ValidationError("Если кандидат не свободен, поле 'офис' должно быть заполнено.")
        
        super(Candidate, self).save(*args, **kwargs)

    class Meta:
        verbose_name = "Кандидат"
        verbose_name_plural = "Кандидаты"
        unique_together = (('email', 'phone'),)

class Invitation(models.Model):
    """
    Модель для хранения информации о приглашениях кандидатов в офисы.

    Поля:
        candidate (ForeignKey): Ссылка на модель кандидата.
        office (ForeignKey): Ссылка на модель офиса.
        created_at (DateField): Дата создания приглашения (устанавливается автоматически).
        status (CharField): Статус приглашения, выбирается из списка:
            - invited: Кандидат приглашён.
            - accepted: Кандидат принял приглашение.
            - rejected: Кандидат отклонил приглашение.
    """

    candidate = models.ForeignKey(
        "Candidate",
        verbose_name="Кандидат",
        on_delete=models.CASCADE,
    )
    office = models.ForeignKey(
        "Office",
        verbose_name="Офис",
        on_delete=models.CASCADE,
    )
    status = models.CharField(
        max_length=50,
        choices=[
            ("invited", "Приглашён"),
            ("accepted", "Принят"),
            ("rejected", "Отклонён"),
        ],
        default="invited",
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Приглашение {self.candidate} в {self.office}"

    class Meta:
        verbose_name = "Приглашение"
        verbose_name_plural = "Приглашения"
        unique_together = (('office', 'candidate', 'status'),)

    
class Office(models.Model):
    """
    Модель для представления офисов.

    Поля:
        name (str): Название офиса (максимальная длина: 255 символов).
        location (str): Местоположение офиса (максимальная длина: 255 символов).
        quota (int): Общее количество квот, выделенных для офиса.
        used_quota (int): Количество использованных квот (по умолчанию 0).

    Методы:
        - `__str__`: Возвращает название офиса.
        - `available_quota`: Возвращает количество оставшихся доступных квот.
    """

    name = models.CharField(max_length=255, verbose_name="Название офиса")
    location = models.CharField(max_length=255, verbose_name="Местоположение")
    quota = models.PositiveIntegerField(verbose_name="Базовая квота")  # Стартовая квота
    used_quota = models.PositiveIntegerField(default=0, verbose_name="Использованная квота")

    def available_quota(self):
        """
        Возвращает количество оставшихся доступных квот.
        """
        return self.quota - self.used_quota

    def reset_quota(self):
        """
        Сбрасывает использованные квоты на следующий месяц.
        """
        self.quota = 0
        self.save()

    def __str__(self):
        return f"{self.name} ({self.location})"

    class Meta:
        verbose_name = "Офис"
        verbose_name_plural = "Офисы"


class Transaction(models.Model):
    """
    Модель для представления транзакций, связанных с офисами.

    Поля:
        operation (str): Тип операции (например, добавление или снятие квот).
        office (ForeignKey): Ссылка на офис, к которому относится транзакция.
        amount (int): Количество квот, изменяемых в результате транзакции.

    """

    OPERATION_CHOICES = [
        ('add', 'Добавление квот'),
        ('subtract', 'Снятие квот'),
    ]

    operation = models.CharField(
        max_length=8,
        choices=OPERATION_CHOICES,
        verbose_name="Операция"
    )
    cause = models.CharField(max_length=128)
    
    office = models.ForeignKey(
        "Office",
        verbose_name="Офис",
        on_delete=models.CASCADE
    )
    amount = models.PositiveIntegerField(verbose_name="Количество")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def apply_transaction(self):
        """
        Применяет транзакцию к связанному офису:
        - Увеличивает или уменьшает количество использованных квот.
        """
        if self.operation == 'add':
            self.office.quota += self.amount
        elif self.operation == 'subtract':
            self.office.quota -= self.amount
        self.office.save()

    def __str__(self):
        return f"{self.get_operation_display()} ({self.amount}) для {self.office}"

    class Meta:
        verbose_name = "Транзакция"
        verbose_name_plural = "Транзакции"
        

class Supervisor(models.Model):
    """
    Модель для представления руководителей.

    Поля:
        user (ForeignKey): Ссылка на пользователя системы (модель User).
        office (ForeignKey): Ссылка на офис, за который отвечает руководитель.
        department (CharField): Название подразделения, которым управляет руководитель.
    """

    user = models.OneToOneField(
        CustomUser,
        verbose_name="Пользователь",
        on_delete=models.CASCADE
    )
    office = models.ForeignKey(
        "Office",
        verbose_name="Офис",
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    department = models.CharField(
        max_length=128,
        verbose_name="Подразделение"
    )

    def __str__(self):
        office_name = self.office.name if self.office else "No office"
        return f"{self.user.get_full_name()} - {self.department} ({office_name})"

    class Meta:
        verbose_name = "Руководитель"
        verbose_name_plural = "Руководители"
        unique_together = (('user', 'office', 'department'),)


class Todo(models.Model):
    """
    Модель для представления задач (ToDo).

    Поля:
        user (ForeignKey): Ссылка на пользователя, которому принадлежит задача.
        task (TextField): Описание задачи.
        due_date (DateTimeField): Дата и время выполнения задачи.
        is_complete (BooleanField): Выполнена ли задача. Если изменяется на True, 
                                    автоматически заполняется дата завершения.
        is_visible (BooleanField): Видима ли задача (по умолчанию True).
        is_deleted (BooleanField): Логическое удаление задачи (по умолчанию False).
        date_update (DateTimeField): Дата и время последнего обновления записи.
        date_creation (DateTimeField): Дата создания задачи.
        date_complete (DateField): Дата завершения задачи (если задача выполнена).

    Методы:
        check_visibility(): Проверяет, прошло ли 12 часов с момента выполнения задачи.
                            Если прошло, скрывает задачу (is_visible=False).
        save(): Переопределённый метод сохранения для автоматического заполнения
               поля `date_complete`, если задача была помечена как выполненная.
    """

    user = models.ForeignKey(
        CustomUser,
        verbose_name="Пользователь",
        on_delete=models.CASCADE
    )
    task = models.TextField(verbose_name="Задача")
    due_date = models.DateTimeField(verbose_name="Дата выполнения")
    
    is_complete = models.BooleanField(default=False, verbose_name="Выполнено")
    is_visible = models.BooleanField(default=True, verbose_name="Видимость")
    is_deleted = models.BooleanField(default=False, verbose_name="Удалена")
    
    date_update = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    date_creation = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    date_complete = models.DateField(null = True, blank=True)

    def check_visibility(self):
        """
        Проверяет и обновляет видимость задачи:
        - Если задача выполнена (`is_complete=True`) и видима (`is_visible=True`),
        - Проверяет, прошло ли 12 часов с момента обновления записи (`date_update`).
        - Если прошло, устанавливает `is_visible=False` и сохраняет запись.
        """
        if self.is_complete and self.is_visible:
            elapsed_time = now() - self.date_update
            if elapsed_time >= timedelta(hours=12):
                self.is_visible = False
                self.save()
                
    def save(self, *args, **kwargs):
        if self.is_complete and not self.date_complete:
            # Если задача выполнена и дата завершения еще не установлена
            self.date_complete = now().date()

        elif not self.is_complete and self.date_complete:
            # Если задача не завершена, и дата завершения уже была установлена,
            # мы не должны её изменять
            pass

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.task} для {self.user.username} (до {self.due_date})"

    class Meta:
        verbose_name = "Задача"
        verbose_name_plural = "Задачи"
        ordering = ['-due_date']  # Последние задачи по дате идут первыми
        
class Favorite(models.Model):
    """
    Модель для хранения избранных кандидатов.

    Поля:
        user (ForeignKey): Пользователь, добавивший кандидата в избранное.
        candidate (ForeignKey): Кандидат, добавленный в избранное.
        created_at (DateTimeField): Дата и время добавления в избранное.
    """

    user = models.ForeignKey(
        CustomUser,
        verbose_name="Пользователь",
        on_delete=models.CASCADE
    )
    candidate = models.ForeignKey(
        "hr.Candidate",
        verbose_name="Кандидат",
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Добавлено в избранное")

    def __str__(self):
        return f"{self.user.username} -> {self.candidate.name} {self.candidate.surname}"

    class Meta:
        verbose_name = "Избранный кандидат"
        verbose_name_plural = "Избранные кандидаты"
        unique_together = (('user', 'candidate'),)

