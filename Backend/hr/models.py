from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

from datetime import date, timedelta


class CustomUser(AbstractUser):
    patronymic = models.CharField(max_length=32, verbose_name='Отчество', null=True, blank=True)
    phone = models.CharField(max_length=15, verbose_name="Номер телефона", blank=True, null=True)
    photo = models.ImageField(upload_to='avatars/users/', null=True, blank=True)
    
    def get_full_name(self):
        return f'{self.last_name} {self.first_name} {self.patronymic}'


class Administrator(models.Model):
    """
    Расширение стандартной модели User для администраторов:
    - Содержит дополнительные поля, такие как права доступа.
    """
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return f'Admin: {self.user.username}'
    
    class Meta:
        verbose_name = "Администратор"
        verbose_name_plural = "Администраторы"
        unique_together = (('user'),)


class Candidate(models.Model):
    """
    Кандидат, который может быть привязан к офису, иметь различные курсы и выполнять проекты.
    
    Поля:
        is_archive (bool): Указывает, активен ли кандидат (по умолчанию True).
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
            * Если is_free = False, это поле обязательно.
            * Если is_free = True, это поле должно быть пустым.
        course_rieltor_join (str): Статус курса "Введение в профессию риэлтор".
        basic_legal_course (str): Статус "Базовый юридический курс".
        course_mortgage (str): Статус курса "Ипотека".
        course_taxation (str): Статус курса "Налогообложение".
        completed_objects (int): Количество выполненных проектов.
        clients (int): Количество обслуженных клиентов.
        created_at (datetime): Дата и время создания записи (устанавливается автоматически).
        updated_at (datetime): Дата и время последнего обновления записи (обновляется автоматически).
    """

    is_archive = models.BooleanField(default=False,  verbose_name="в архиве")
    name = models.CharField(max_length=16, verbose_name="имя")
    surname = models.CharField(max_length=64, verbose_name="фамилия")
    patronymic = models.CharField(max_length=32, null=True, blank=True, verbose_name="отчество")
    birth = models.DateField(null=True, blank=True, verbose_name="дата рождения")
    education = models.CharField(max_length=128, null=True, blank=True, verbose_name="образование")
    photo = models.ImageField(upload_to='avatars/candidates/', null=True, blank=True, verbose_name="фото")

    country = models.CharField(max_length=32, default="Россия", verbose_name="страна")
    city = models.CharField(max_length=32, verbose_name="город", blank=True, null=True)

    email = models.EmailField(null=True, blank=True, verbose_name="почта")
    phone = models.CharField(max_length=16, verbose_name="телефон", blank=True)
    resume = models.CharField(max_length=128, null=True, blank=True, verbose_name="резюме")
    agreement = models.FileField(null=True, blank= True, verbose_name='Согласие на ОПД')

    is_free = models.BooleanField(default=True, verbose_name="свободен")
    office = models.ForeignKey(
        "hr.Office",
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    courses = models.ManyToManyField("Course",related_name="candidates", blank=True, null=True )
    
    achivment_objects = models.PositiveIntegerField(default=0, verbose_name="Объекты")
    achivment_clients = models.PositiveIntegerField(default=0, verbose_name="Клиенты")
    achivment_leads = models.PositiveIntegerField(default=0, verbose_name="Лиды")
    achivment_exclusives = models.PositiveIntegerField(default=0, verbose_name="Эксклюзивы")
    achivment_deals = models.PositiveIntegerField(default=0, verbose_name="Cделки")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="создан")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="обновлён")

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
        
        if self.birth and self.birth > date.today():
            raise ValidationError("Дата рождения не может быть в будущем.")
        
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
            ('self_rejected', "Отказ Кандидата"),
        ],
        default="invited", 
        verbose_name="статус"
    )
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="отправлено")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="обновлено")

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
        - __str__: Возвращает название офиса.
        - available_quota: Возвращает количество оставшихся доступных квот.
    """

    name = models.CharField(max_length=255, verbose_name="Название офиса")
    location = models.CharField(max_length=255, verbose_name="Местоположение")
    phone = models.CharField(max_length=15, null=True, blank=True, verbose_name="телефон")
    quota = models.PositiveIntegerField(verbose_name="Базовая квота")  
    used_quota = models.PositiveIntegerField(default=0, verbose_name="Использованная квота")
    
    created_at = models.DateTimeField(auto_now_add=True)

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
        
    def change_quota(self, operation, count):
        if operation == 'add':
            self.quota += count
            self.save()
            return True, self.quota
        elif operation == 'subtract':
            if self.quota > count:
                return False, 'Недостаточно квот для снятия'
            self.quota -= count
            self.save()
            return True, self.quota

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
        cause (str): причина

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
    cause = models.CharField(max_length=128, verbose_name='причина')
    
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
        verbose_name="Подразделение",
        null = True,
        blank = True
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
        complete_at (DateField): Дата завершения задачи (если задача выполнена).

    Методы:
        check_visibility(): Проверяет, прошло ли 12 часов с момента выполнения задачи.
                            Если прошло, скрывает задачу (is_visible=False).
        save(): Переопределённый метод сохранения для автоматического заполнения
               поля complete_at, если задача была помечена как выполненная.
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
    
    update_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    complete_at = models.DateField(null = True, blank=True)

    def check_visibility(self):
        """
        Проверяет и обновляет видимость задачи:
        - Если задача выполнена (is_complete=True) и видима (is_visible=True),
        - Проверяет, прошло ли 12 часов с момента обновления записи (date_update).
        - Если прошло, устанавливает is_visible=False и сохраняет запись.
        """
        if self.is_complete and self.is_visible:
            elapsed_time = now() - self.update_at
            if elapsed_time >= timedelta(hours=12):
                self.is_visible = False
                self.save()
                
    def save(self, *args, **kwargs):
        if self.is_complete and not self.complete_at:
            # Если задача выполнена и дата завершения еще не установлена
            self.complete_at = now().date()

        elif not self.is_complete and self.complete_at:
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


class ChatLink(models.Model):
    """
    Модель для хранения актуальной ссылки на чат для связи

    Поля:
        user (ForeignKey): Пользователь, добавивший ссылку
        candidate (ForeignKey): Кандидат, добавленный в избранное.
        created_at (DateTimeField): Дата и время добавления в избранное.
    """
    PLATFORM_CHOICES = [
        ('telegram', 'Telegram'),
        ('whatsapp', 'Whatsapp'),
    ]

    user = models.ForeignKey(
        CustomUser,
        verbose_name="Пользователь",
        on_delete=models.CASCADE
    )
    platform = models.CharField(
        max_length=16,
        choices=PLATFORM_CHOICES,
        verbose_name="Платформа"
    )
    
    is_active = models.BooleanField(verbose_name='активна',default=True)
    link = models.CharField(max_length=512, verbose_name='Ссылка')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="добавлена")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Стала неактивной")

    def __str__(self):
        return f"{self.user.username} -> {self.platform}"

    class Meta:
        verbose_name = "Активная ссылка"
        verbose_name_plural = "Ссылки"

class QuotaRequest(models.Model):
    STATUS_CHOICES = [
        ('waited', 'ожидание'),
        ('accepted', 'Принято'),
        ('rejected', 'Отклонено')
    ]
    
    office = models.ForeignKey(Office, verbose_name='оффис', on_delete=models.CASCADE)
    amount = models.PositiveIntegerField()
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default='waited', verbose_name='статус')
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="создано")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="обновлено")
    
    def __str__(self):
        return f'запрос {self.amount} квот для {self.office.name}'


    class Meta:
        verbose_name = "Запрос"
        verbose_name_plural = "Запросы"
        
class Course(models.Model):
    name = models.CharField(max_length=32, verbose_name='Название')
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Курс"
        verbose_name_plural = "Курсы"