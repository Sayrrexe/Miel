# Используем официальный образ Python
FROM python:3.12

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY requirements.txt /app/

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь проект в рабочую директорию
COPY  Miel/ /app/

# Открываем порт 50000
EXPOSE 80

# Команда для запуска приложения

CMD ["python", "manage.py", "runserver", "0.0.0.0:80"]