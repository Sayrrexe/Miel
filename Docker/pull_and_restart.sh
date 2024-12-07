#!/bin/bash

cd /app

# Обновляем код
git pull origin <branch_name>

# Применяем миграции
python manage.py migrate

# Перезапускаем Django-приложение
pkill -f runserver
python manage.py runserver 0.0.0.0:80 &
