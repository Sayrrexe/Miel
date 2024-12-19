# Используем официальный образ Python в качестве базового
FROM python:3.12-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем зависимости системы
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Копируем и устанавливаем зависимости Python
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Копируем исходный код проекта
COPY . .

# Собираем статические файлы (если необходимо)
RUN python manage.py collectstatic --noinput
RUN python manage.py migrate --noinput



# Указываем команду для запуска приложения
CMD ["gunicorn", "Miel.wsgi:application", "--bind", "0.0.0.0:8000"]
