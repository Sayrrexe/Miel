FROM python:3.12

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файл зависимостей (requirements.txt) в контейнер
COPY requirements.txt /app/

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь код проекта в контейнер
COPY Miel/ /app/

# Собираем статические файлы
RUN python /app/manage.py collectstatic --noinput

# Выполняем миграции базы данных
RUN python /app/manage.py migrate

# Открываем порт
EXPOSE 8080

# Команда для запуска приложения
CMD ["python", "/app/manage.py", "runserver", "0.0.0.0:8080"]
