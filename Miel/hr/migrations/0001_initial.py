# Generated by Django 5.1.3 on 2024-11-27 11:16

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Office',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Название офиса')),
                ('location', models.CharField(max_length=255, verbose_name='Местоположение')),
                ('quota', models.PositiveIntegerField(verbose_name='Базовая квота')),
                ('used_quota', models.PositiveIntegerField(default=0, verbose_name='Использованная квота')),
            ],
            options={
                'verbose_name': 'Офис',
                'verbose_name_plural': 'Офисы',
            },
        ),
        migrations.CreateModel(
            name='Candidate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True)),
                ('name', models.CharField(max_length=16)),
                ('surname', models.CharField(max_length=64)),
                ('patronymic', models.CharField(blank=True, max_length=32, null=True)),
                ('birth', models.DateField(blank=True, null=True)),
                ('education', models.CharField(blank=True, max_length=128, null=True, verbose_name='Образование')),
                ('photo', models.CharField(blank=True, max_length=128, null=True)),
                ('country', models.CharField(default='Россия', max_length=32)),
                ('city', models.CharField(max_length=32)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('phone', models.CharField(max_length=16)),
                ('resume', models.CharField(max_length=128)),
                ('is_free', models.BooleanField(default=True)),
                ('legal_course_status', models.CharField(choices=[('in_progress', 'В процессе'), ('completed', 'Сдан'), ('failed', 'Не сдан')], default='in_progress', max_length=16, verbose_name='Статус юридического курса')),
                ('completed_objects', models.PositiveIntegerField(default=0, verbose_name='Объекты')),
                ('clients', models.PositiveIntegerField(default=0, verbose_name='клиенты')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('office', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='hr.office', verbose_name='Офис')),
            ],
            options={
                'verbose_name': 'Кандидат',
                'verbose_name_plural': 'Кандидаты',
                'unique_together': {('email', 'phone')},
            },
        ),
        migrations.CreateModel(
            name='Todo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('task', models.TextField(verbose_name='Задача')),
                ('due_date', models.DateTimeField(verbose_name='Дата выполнения')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'verbose_name': 'Задача',
                'verbose_name_plural': 'Задачи',
                'ordering': ['-due_date'],
            },
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('operation', models.CharField(choices=[('add', 'Добавление квот'), ('subtract', 'Снятие квот')], max_length=8, verbose_name='Операция')),
                ('amount', models.PositiveIntegerField(verbose_name='Количество')),
                ('office', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hr.office', verbose_name='Офис')),
            ],
            options={
                'verbose_name': 'Транзакция',
                'verbose_name_plural': 'Транзакции',
            },
        ),
        migrations.CreateModel(
            name='Favorite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Добавлено в избранное')),
                ('candidate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hr.candidate', verbose_name='Кандидат')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'verbose_name': 'Избранный кандидат',
                'verbose_name_plural': 'Избранные кандидаты',
                'unique_together': {('user', 'candidate')},
            },
        ),
        migrations.CreateModel(
            name='Moderator',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Модератор',
                'verbose_name_plural': 'Модераторы',
                'unique_together': {('user',)},
            },
        ),
        migrations.CreateModel(
            name='Invitation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(auto_now_add=True)),
                ('status', models.CharField(choices=[('invited', 'Приглашён'), ('accepted', 'Принят'), ('rejected', 'Отклонён')], default='invited', max_length=50)),
                ('candidate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hr.candidate', verbose_name='Кандидат')),
                ('office', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hr.office', verbose_name='Офис')),
            ],
            options={
                'verbose_name': 'Приглашение',
                'verbose_name_plural': 'Приглашения',
                'unique_together': {('office', 'candidate', 'status')},
            },
        ),
        migrations.CreateModel(
            name='Supervisor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('department', models.CharField(max_length=128, verbose_name='Подразделение')),
                ('office', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hr.office', verbose_name='Офис')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'verbose_name': 'Руководитель',
                'verbose_name_plural': 'Руководители',
                'unique_together': {('user', 'office', 'department')},
            },
        ),
    ]