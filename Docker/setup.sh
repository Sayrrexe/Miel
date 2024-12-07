#!/bin/bash
BASE_DIR=$(pwd)/Miel

# Создание папок
mkdir -p "$BASE_DIR/logs"
mkdir -p "$BASE_DIR/templates"
mkdir -p "$BASE_DIR/static"
mkdir -p "$BASE_DIR/media"

# Создание файлов
echo -e "DJANGO_SECRET_KEY=your-secret-key\nDJANGO_DEBUG=False\nDJANGO_ALLOWED_HOSTS=localhost,127.0.0.1" > "$BASE_DIR/.env"
echo -e "" > "$BASE_DIR/logs/app.log"
echo -e "<!DOCTYPE html>\n<html>\n<head>\n<title>Base Template</title>\n</head>\n<body>\n{% block content %}{% endblock %}\n</body>\n</html>" > "$BASE_DIR/templates/base.html"

# Установка Gunicorn
echo "Устанавливаем Gunicorn..."
pip install gunicorn

# Подтверждение
echo "Структура проекта создана, Gunicorn установлен!"