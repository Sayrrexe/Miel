# Miel

## 💡 Установка и запуск

1. **📥 Клонируйте проект**  
   ```bash
   git clone https://github.com/Sayrrexe/Miel.git
   cd Miel
   ```

2. **🔧 Создайте виртуальное окружение и установите зависимости**  
   ```bash
   python -m venv venv
   source venv/bin/activate  # Для Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cd Miel
   ```

3. **📂 Примените миграции**  
   ```bash
   python manage.py migrate
   ```

4. **🧑‍💻 Создайте суперпользователя**  
   ```bash
   python manage.py createsuperuser
   ```

5. **🚀 Запустите сервер**  
   ```bash
   python manage.py runserver
   ```

6. **🌐 Откройте API-документацию**  
   Перейдите по адресу [http://127.0.0.1:8000/api/schema/swagger-ui/](http://127.0.0.1:8000/api/schema/swagger-ui//) или [http://127.0.0.1:8000/api/schema/redoc/](http://127.0.0.1:8000/api/schema/redoc/) 

---

## 🛠️ Тестирование API

1. **🔑 Авторизация**  
   - Войдите через `/api/v1/login/` с вашими данными.
   - Получите токен авторизации.

2. **📡 Тестирование эндпоинтов**  
   Используйте инструменты вроде Postman или cURL. Например:  
   ```bash
   curl -X GET http://127.0.0.1:8000/api/v1/todos/ -H "Authorization: Token <ВАШ_ТОКЕН>"
   ```

3. **📜 Эндпоинты**
   - 🔑 `/api/v1/login/` - Авторизация
   - 🚪 `/api/v1/logout/` - Выход
   - 📋 `/api/v1/todos/` - Управление задачами (CRUD)
   - 🔒 `/api/v1/protected/` - Доступ к защищенным данным

---

## 🧪 Полезные команды для разработки

- **Создать миграции:**  
  ```bash
  python manage.py makemigrations
  ```

- **Применить миграции:**  
  ```bash
  python manage.py migrate
  ```

- **Сброс базы данных (в случае необходимости):**  
  ```bash
  python manage.py flush
  ```