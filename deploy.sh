#!/bin/bash

# === Проверка зависимостей ===

echo "Для корректной работы скрипта необходимо обеспечить работу команд docker без root прав ( sudo ), для этого вам нужно ввести "
echo "sudo usermod -aG docker $USER"
echo "newgrp docker"
echo "Если у вас нет такой настройки нажмите 2 и выполните указанные операции, если нет - продолжайте"
echo "1. да (по умолчанию)"
echo "2. нет"
read CHOICE_HOSTS
if [ "$CHOICE_HOSTS" == "1" ]; then
    echo "Продолжаем..."
    clear
else
    exit
fi

clear
echo "Проверяем наличие необходимых инструментов..."

# Проверка Docker
if ! [ -x "$(command -v docker)" ]; then
    echo "Ошибка: Docker не установлен. Установите Docker и повторите попытку." >&2
    exit 1
fi

# Проверка Docker Compose
if ! [ -x "$(command -v docker-compose)" ]; then
    echo "Ошибка: Docker Compose не установлен. Установите Docker Compose и повторите попытку." >&2
    exit 1
fi

# Проверка Python
if ! [ -x "$(command -v python3)" ]; then
    echo "Ошибка: Python3 не установлен. Установите Python3 и повторите попытку." >&2
    exit 1
fi

clear

echo "Все необходимые инструменты установлены."

# === Запрос данных у пользователя ===
echo "Введите DJANGO_SECRET_KEY:"
read DJANGO_SECRET_KEY

echo "Введите значение DJANGO_DEBUG (True/False):"
read DJANGO_DEBUG

echo "хотите добавить ALLOWED HOSTS: 127.0.0.1,localhost):"
echo "1. да (по умолчанию)"
echo "2. нет"
read CHOICE_HOSTS
if [ "$CHOICE_HOSTS" == "1" ]; then
    echo "Добавляем..."
    DJANGO_ALLOWED_HOSTS='127.0.0.1,localhost'

else
    echo "Пропуск."
    DJANGO_ALLOWED_HOSTS=""
fi

echo "введите iP вашего сервера ( как в ssh )?"
read SERVER_IP

echo "Введите ip для CORS, если необоходимо"
read CSRF_IP

# === Выбор базы данных ===
echo "Выберите базу данных (по умолчанию PostgreSQL):"
echo "1. PostgreSQL (по умолчанию)"
echo "2. SQLite3"
read DB_CHOICE

if [ "$DB_CHOICE" == "2" ]; then
    echo "Вы выбрали SQLite3"
    USE_POSTGRESQL=false
else
    echo "Вы выбрали PostgreSQL (по умолчанию)"
    USE_POSTGRESQL=true

    # Запрос параметров для PostgreSQL
    echo "Введите имя базы данных (например: mydatabase):"
    read POSTGRES_DB
    echo "Введите имя пользователя базы данных (например: myuser):"
    read POSTGRES_USER
    echo "Введите пароль для базы данных:"
    read POSTGRES_PASSWORD
fi

# === Создание файла .env ===
echo "Генерируем .env файл..."
if [ "$USE_POSTGRESQL" == "true" ]; then
    cat <<EOL > Backend/Miel/.env
DJANGO_SECRET_KEY=$DJANGO_SECRET_KEY
DJANGO_DEBUG=$DJANGO_DEBUG
CSRF_TRUSTED_ORIGINS=$CSRF_IP

DJANGO_ALLOWED_HOSTS=$DJANGO_ALLOWED_HOSTS,$SERVER_IP
DATABASE_NAME=$POSTGRES_DB
DATABASE_USER=$POSTGRES_USER
DATABASE_PASSWORD=$POSTGRES_PASSWORD
DATABASE_HOST=db
DATABASE_PORT=5432
EOL
    cat <<EOL > Backend/Miel/db.env
POSTGRES_DB=$POSTGRES_DB
POSTGRES_USER=$POSTGRES_USER
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
EOL
else
    cat <<EOL > Backend/Miel/.env
DJANGO_SECRET_KEY=$DJANGO_SECRET_KEY
DJANGO_DEBUG=$DJANGO_DEBUG
DJANGO_ALLOWED_HOSTS=$DJANGO_ALLOWED_HOSTS,$SERVER_IP
EOL
fi
echo ".env файл создан!"

# === Обновление settings.py ===
echo "Обновляем settings.py..."
if [ "$USE_POSTGRESQL" == "true" ]; then
    echo "Не требуется..."
else
    sed -i "s/'ENGINE': 'django.db.backends.postgresql'/'ENGINE': 'django.db.backends.sqlite3'/g" Backend/Miel/settings.py
    sed -i "s|os.getenv('DATABASE_NAME')|BASE_DIR / 'db.sqlite3'|g" Backend/Miel/settings.py
    sed -i "/'USER': os.getenv('DATABASE_USER'),/d" Backend/Miel/settings.py
    sed -i "/'PASSWORD': os.getenv('DATABASE_PASSWORD'),/d" Backend/Miel/settings.py
    sed -i "/'HOST': os.getenv('DATABASE_HOST'),/d" Backend/Miel/settings.py
    sed -i "/'PORT': os.getenv('DATABASE_PORT'),/d" Backend/Miel/settings.py
fi
echo "settings.py обновлён!"
sleep 1

# === Проверка docker-compose.yml ===
clear
echo "Введите желаемый порт nginx(например: 80)"
read NGINX_PORT
echo "Введите желаемый ip nginx(например: localhost)"
read NGINX_IP

CURRENT_DIR=$(pwd)
# === Генерация docker-compose.yml ===

if [ "$USE_POSTGRESQL" == "true" ]; then
echo "Генерируем docker-compose.yml..."
    cat <<EOL > docker-compose.yml
version: '3.8'

services:
  backend:
    build:
      context: ./Backend
    container_name: django_backend
    command: gunicorn Miel.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - ./Backend:/app
      - static_volume:/app/static  
      - media_volume:/app/media
      - ./Backend/logs/app.log:/app/logs/app.log
    env_file:
      - ./Backend/Miel/.env
    ports:
      - "8000:8000"
    depends_on:
      - db
    restart: unless-stopped

  frontend:
    build:
      context: ./Frontend
      dockerfile: Dockerfile
    container_name: nextjs_frontend
    environment:
      - NODE_ENV=development
    ports:
      - "3000:3000"
    depends_on:
      - backend
    restart: unless-stopped

  db:
    image: postgres:15
    container_name: postgres_db
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    env_file:
      - ./Backend/Miel/db.env
    ports:
      - "5432:5432"
    restart: unless-stopped

  nginx:
    image: nginx:latest
    container_name: nginx_server
    ports:
      - "$NGINX_PORT:$NGINX_PORT"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/blockips.conf:/etc/nginx/blockips.conf:ro
      - static_volume:/app/static  
      - media_volume:/app/media    
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  static_volume:
  media_volume:
EOL
else
echo "Генерируем docker-compose.yml..."
    cat <<EOL > docker-compose.yml
version: '3.8'

services:
  backend:
    build:
      context: ./Backend
    container_name: django_backend
    command: gunicorn Miel.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - ./Backend:/app  
      - static_volume:/app/static  
      - media_volume:/app/media   
      - $CURRENT_DIR/Backend/logs/app.log:/app/logs/app.log
      - $CURRENT_DIR/Backend/db.sqlite3:/app/db.sqlite3 
    env_file:
      - ./Backend/Miel/.env
    ports:
      - "8000:8000"
    restart: unless-stopped

  frontend:
    build:
      context: ./Frontend
      dockerfile: Dockerfile
    container_name: nextjs_frontend
    environment:
      - NODE_ENV=development
    ports:
      - "3000:3000"
    depends_on:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:latest
    container_name: nginx_server
    ports:
      - "$NGINX_PORT:$NGINX_PORT"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - static_volume:/app/static  
      - media_volume:/app/media   
      - $CURRENT_DIR/Backend/logs/app.log:/app/logs/app.log 
    depends_on:
      - frontend
      - backend

volumes:
  static_volume:
  media_volume:
EOL
echo "docker-compose.yml создан!"
fi

# === Настройка окружения и миграция ===
cd Backend

echo "Создаём директорию для логов..."
mkdir -p logs
touch logs/app.log
cd ..

# === Настройка nginx ===
cd nginx

if [ -n "$SERVER_IP" ]; then
    echo "Обновляем конфигурацию NGINX с использованием IP сервера..."
    sed -i "s/server_name localhost;/server_name $NGINX_IP;/" nginx.conf
    sed -i "s/listen 80;/listen $NGINX_PORT;/" nginx.conf
    echo "Конфигурация NGINX обновлена с server_name $SERVER_IP."
else
    echo "Используется конфигурация NGINX по умолчанию (server_name localhost)."
fi
cd ..
sleep 1

clear
read -p "Хочешь заполнить БД? (y/n): " confirm

if [[ "$confirm" == "y" || "$confirm" == "Y" ]]; then
    echo "Создание структуры management commands..."
    
    mkdir -p Backend/hr/management/commands
    touch Backend/hr/management/__init__.py
    touch Backend/hr/management/commands/__init__.py
    
    cat > Backend/hr/management/commands/populate_db.py <<EOL
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from hr.models import *
from datetime import date

User = get_user_model()

def create_users():
    users = [
        ("root", "root", "superadmin"),
        ("supervisor", "supervisor", "supervisor"),
        ("admin", "admin", "admin"),
    ]
    
    for username, password, role in users:
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(
                username=username,
                password=password,
                is_staff=True if role == "superadmin" else False,
                is_superuser=True if role == "superadmin" else False,
            )
            print(f"User {username} created.")
        else:
            print(f"User {username} already exists.")

def create_offices():
    offices = [
        {"name": "Офис Москва", "location": "Москва", "quota": 10},
        {"name": "Офис СПб", "location": "Санкт-Петербург", "quota": 8},
    ]
    for office_data in offices:
        Office.objects.get_or_create(**office_data)
    print("Offices created.")

def create_candidates():
    candidates = [
        {"name": "Иван", "surname": "Иванов", "birth": date(1990, 5, 15), "phone": "+79001112233"},
        {"name": "Петр", "surname": "Петров", "birth": date(1985, 7, 20), "phone": "+79005556677"},
    ]
    for candidate_data in candidates:
        Candidate.objects.get_or_create(**candidate_data)
    print("Candidates created.")

def create_transactions():
    office = Office.objects.first()
    if office:
        transactions = [
            {"operation": "add", "amount": 5, "office": office, "cause": "Дополнительная квота"},
            {"operation": "subtract", "amount": 2, "office": office, "cause": "Использование квоты"},
        ]
        for transaction_data in transactions:
            Transaction.objects.get_or_create(**transaction_data)
        print("Transactions created.")

def create_supervisors():
    office = Office.objects.first()
    user = User.objects.filter(username="supervisor").first()
    if user and office:
        Supervisor.objects.get_or_create(user=user, office=office, department="Отдел продаж")
    print("Supervisors created.")

def create_administrators():
    user = User.objects.filter(username="admin").first()
    if user:
        Administrator.objects.get_or_create(user=user)
    print("Administrators created.")

def create_todos():
    user = User.objects.filter(username="admin").first()
    if user:
        Todo.objects.get_or_create(user=user, task="Подготовить отчет", due_date=date(2025, 2, 10))
        Todo.objects.get_or_create(user=user, task="Собеседование с кандидатом", due_date=date(2025, 2, 15))
    print("ToDos created.")

class Command(BaseCommand):
    help = "Заполняет базу тестовыми данными"

    def handle(self, *args, **kwargs):
        create_users()
        create_offices()
        create_candidates()
        create_transactions()
        create_supervisors()
        create_administrators()
        create_todos()
        print("Test data populated successfully.")
EOL
echo "Скрипт Создан."
sleep 1
clear
else
    clear
fi
# === Остановка и удаление существующих контейнеров и томов данных ===
echo "Останавливаем и удаляем существующие контейнеры и тома данных..."
docker-compose down -v
sleep 1

# === Запуск Docker ===
clear
echo "Запуск Docker контейнеров..."
docker-compose up -d --build
sleep 1

clear
echo "Контейнеры запущены!"

# === Развёртывание базы данных ===
echo "Обновляем настраиваем базу данных..."
if [ "$USE_POSTGRESQL" == "true" ]; then
  # === Ожидание готовности приложения ===
  echo "Ожидаем, пока бэкенд станет доступен..."
  sleep 15  # Можно увеличить время ожидания при необходимости

  # === Применение миграций и создание суперпользователя ===
  echo "Применяем миграции базы данных..."
  until docker exec -it django_backend python manage.py migrate; do
      echo "Ожидание готовности Django-сервера..."
      sleep 5
  done
  if [ "$confirm" == "y" ]; then
      echo "заполняем базу данных"
      docker exec -it django_backend python manage.py populate_db
  fi
  echo "Собираем статику"
  docker exec -it django_backend python manage.py collectstatic --noinput

else
  echo "Настраиваем базу данных sqlite..."
  cd Backend
  rm -rf db.sqlite3
  echo "Запускаем виртуальное окружение..."
  python3 -m venv .venv
  source .venv/bin/activate
  pip3 install -r requirements.txt
  echo "Применяем миграции..."
  python manage.py migrate
  if [ "$confirm" == "y" ]; then
    echo "заполняем базу данных"
    docker exec -it django_backend python manage.py populate_db
  fi
  echo "Удаляем кеш"
  rm -rf .venv
  cd ..
fi

# === Конец ===
clear
sleep 3
echo "Развёртывание завершено!"