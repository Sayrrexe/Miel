# MIEL

**MIEL** — это система управления процессом найма сотрудников, разработанная для руководителей офисов. Система позволяет администраторам вручную добавлять кандидатов, а руководители офисов могут отправлять запросы на трудоустройство. Включает управление квотами на приглашения и систему отслеживания приглашений через уникальные ссылки.

---

## Возможности

- **Управление кандидатами**: Администратор вручную добавляет кандидатов в систему.  
- **Управление квотами**: Ограничение на количество приглашений для каждого руководителя офиса.  
- **Система приглашений**: Отслеживание и маршрутизация приглашений по выбранным администратором ссылкам.  
- **Работа через API**: Полный функционал доступен через REST API с визуализацией в Swagger UI.  


##  **Стек технологий**: Python, Django REST Framework (DRF), PostgreSQL, React, Next.js.

---

## Установка

### Клонирование репозитория
```bash
git clone https://github.com/sayrrexe/Miel
cd Miel/
```

---

### Автоматический деплой через скрипт

Скрипт автоматизирует процесс настройки, выбора базы данных (PostgreSQL или SQLite) и запуска проекта через Docker.

1. **Запуск скрипта:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

2. **Что делает скрипт:**
   - Запрашивает переменные окружения, включая `DJANGO_SECRET_KEY`, `DATABASE_NAME` и другие.
   - Позволяет выбрать базу данных: PostgreSQL или SQLite.
   - Создаёт или обновляет `.env` файл.
   - Обновляет `docker-compose.yml` для хранения базы SQLite на хосте или для PostgreSQL.
   - Устанавливает виртуальное окружение и зависимости.
   - Выполняет миграции и создаёт суперпользователя.
   - Запускает проект через Docker Compose.
---

### Ручная настройка 

1. Создайте виртуальное окружение и установите зависимости:
   ```bash
   cd Backend
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

2. Создайте директорию для логов:
   ```bash
   mkdir logs
   cd logs
   touch app.log
   cd ..
   ```

3. Создайте файлы с секретами:
   ```bash
   cd Backend/Miel
   ```
.env
```env
# Django Settings /Miel/Backend/Miel/.env
DJANGO_SECRET_KEY='your_secret_key_here'
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost,your_server_ip

# Database Settings
DATABASE_NAME=Mieldb
DATABASE_USER=Mieluser
DATABASE_PASSWORD=password
DATABASE_HOST=db
DATABASE_PORT=5432

```

db.env
```env
# Django Settings /Miel/Backend/Miel/db.env
POSTGRES_DB=Mieldb
POSTGRES_USER=Mieluser
POSTGRES_PASSWORD=228228
```
уточнение структуры:
```
your-repo/
├── Backend/
│   ├── Miel/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   ├── .env <-- для setting.py
│   │   ├── db.env < -- для базы данных
│   │   └── ... (другие файлы и директории)
│   ├── manage.py
│   └── ... (другие файлы и директории)
```

4. Выполните миграции и создайте суперпользователя:
   ```bash
   python3 manage.py collectstatic
   python3 manage.py migrate
   python3 manage.py createsuperuser
   ```

   Дефолтные данные для суперпользователя:
   - Логин: `root`
   - Email: `root@root.com`
   - Пароль: `root`

5. Запустите проект через Docker:
   ```bash
   cd ..
   docker-compose up -d --build
   ```

---
## Использование

1. **Суперпользователь**: Войдите в систему под суперпользователем (`root`) и создайте администратора.  
2. **Администратор**: Администратор приглашает руководителей офисов и добавляет кандидатов.  
3. **Документация API**: Доступна по адресу `/api/schema/swagger-ui`.

---

## Контакты

- **Discord**: [wiseprg](https://discordapp.com/users/593709760805863424/)  
- **Telegram**: [Wiseprog](https://t.me/Wiseprog)  

---

## Лицензия

Проект разработан под конкретные нужды заказчика и не предназначен для общего использования.
