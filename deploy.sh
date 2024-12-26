#!/bin/bash

# === Проверка зависимостей ===
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

echo "Все необходимые инструменты установлены."

# === Запрос данных у пользователя ===
echo "Введите DJANGO_SECRET_KEY:"
read DJANGO_SECRET_KEY

echo "Введите значение DJANGO_DEBUG (True/False):"
read DJANGO_DEBUG

echo "Введите DJANGO_ALLOWED_HOSTS (например: 127.0.0.1,localhost):"
read DJANGO_ALLOWED_HOSTS

echo "изменить настройки nginx на ip вашего сервера?"
echo "1. нет (по умолчанию)"
echo "2. да"
read IP_CHOICE
if [ "$IP_CHOICE" == "2" ]; then
    echo "Введите IP"
    read SERVER_IP

else
    echo "Пропуск."
    SERVER_IP=""
fi

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
DJANGO_ALLOWED_HOSTS=$DJANGO_ALLOWED_HOSTS,$SERVER_IP
DATABASE_NAME=$POSTGRES_DB
DATABASE_USER=$POSTGRES_USER
DATABASE_PASSWORD=$POSTGRES_PASSWORD
DATABASE_HOST=db
DATABASE_PORT=5432
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
    # Удаляем старые строки с параметрами базы данных
    sed -i "/'USER'/d" Backend/Miel/settings.py
    sed -i "/'PASSWORD'/d" Backend/Miel/settings.py
    sed -i "/'HOST'/d" Backend/Miel/settings.py
    sed -i "/'PORT'/d" Backend/Miel/settings.py

    # Обновляем движок базы данных
    sed -i "s|'ENGINE': 'django.db.backends.sqlite3'|'ENGINE': 'django.db.backends.postgresql'|g" Backend/Miel/settings.py
    sed -i "s|BASE_DIR / 'db.sqlite3'|os.getenv('DATABASE_NAME')|g" Backend/Miel/settings.py

    # Добавляем новые параметры
    sed -i "/'NAME': os.getenv('DATABASE_NAME')/a \        'USER': os.getenv('DATABASE_USER'),\n        'PASSWORD': os.getenv('DATABASE_PASSWORD'),\n        'HOST': os.getenv('DATABASE_HOST'),\n        'PORT': os.getenv('DATABASE_PORT')," Backend/Miel/settings.py
else
    # Возврат к SQLite и удаление параметров PostgreSQL
    sed -i "s|'ENGINE': 'django.db.backends.postgresql'|'ENGINE': 'django.db.backends.sqlite3'|g" Backend/Miel/settings.py
    sed -i "s|os.getenv('DATABASE_NAME')|BASE_DIR / 'db.sqlite3'|g" Backend/Miel/settings.py
    sed -i "/'USER'/d" Backend/Miel/settings.py
    sed -i "/'PASSWORD'/d" Backend/Miel/settings.py
    sed -i "/'HOST'/d" Backend/Miel/settings.py
    sed -i "/'PORT'/d" Backend/Miel/settings.py
fi
echo "settings.py обновлён!"


# === Проверка docker-compose.yml ===
if [ -f "docker-compose.yml" ]; then
    echo "Файл docker-compose.yml уже существует."
    echo "Создаём резервную копию..."
    cp docker-compose.yml docker-compose.yml.bak
    echo "Резервная копия сохранена как docker-compose.yml.bak"
fi

CURRENT_DIR=$(pwd)
# === Генерация docker-compose.yml ===
echo "Генерируем docker-compose.yml..."
if [ "$USE_POSTGRESQL" == "true" ]; then
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
    env_file:
      - ./Backend/Miel/.env
    ports:
      - "8000:8000"
    depends_on:
      - db

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

  db:
    image: postgres:15
    container_name: postgres_db
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    environment:
      - POSTGRES_DB=$POSTGRES_DB
      - POSTGRES_USER=$POSTGRES_USER
      - POSTGRES_PASSWORD=$POSTGRES_PASSWORD
    ports:
      - "5432:5432"

  nginx:
    image: nginx:latest
    container_name: nginx_server
    ports:
      - "80:80"
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
  postgres_data:
  static_volume:
  media_volume:
EOL
else
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

  nginx:
    image: nginx:latest
    container_name: nginx_server
    ports:
      - "80:80"
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
fi
echo "docker-compose.yml создан!"

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
    sed -i "s/server_name localhost;/server_name $SERVER_IP;/" nginx.conf
    echo "Конфигурация NGINX обновлена с server_name $SERVER_IP."
else
    echo "Используется конфигурация NGINX по умолчанию (server_name localhost)."
fi
cd ..

# === Запуск Docker ===
echo "Запуск Docker контейнеров..."
docker-compose up -d --build

echo "Контейнеры запущены!"

# === Ожидание готовности приложения ===
echo "Ожидаем, пока бэкенд станет доступен..."
sleep 10  # Можно увеличить время ожидания при необходимости

# === Применение миграций и создание суперпользователя ===
echo "Применяем миграции базы данных..."
docker exec -it django_backend python manage.py migrate
docker exec -it django_backend python manage.py collectstatic --noinput

echo "Создаём суперпользователя..."
docker exec -it django_backend python manage.py createsuperuser
echo "Суперпользователь создан успешно!"

# === Конец ===

echo "Развёртывание завершено!"
