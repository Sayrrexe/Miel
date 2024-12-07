# Используем официальный образ Python
FROM python:3.12

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файл зависимостей
COPY requirements.txt /app/

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Устанавливаем cron и git
RUN apt-get update && apt-get install -y git cron && rm -rf /var/lib/apt/lists/*

# Копируем код проекта
COPY Miel/ /app/

# Копируем скрипты
COPY pull_and_restart.sh /pull_and_restart.sh
COPY crontab.txt /etc/cron.d/git-cron

# Делаем скрипт и cron-файл исполняемыми
RUN chmod +x /pull_and_restart.sh
RUN chmod 0644 /etc/cron.d/git-cron

# Настраиваем cron
RUN touch /var/log/cron.log

# Открываем порт
EXPOSE 80

# Запуск cron и Django-приложения
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
