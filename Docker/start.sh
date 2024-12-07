#!/bin/bash

# Запускаем cron
cron

# Запускаем сервер Django
python manage.py runserver 0.0.0.0:80
