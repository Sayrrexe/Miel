FROM node:18-alpine AS dev

# Установим рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Установим зависимости
RUN npm install

# Копируем весь исходный код
COPY . .

# Экспонируем порт
EXPOSE 3000

# Команда для запуска в режиме разработки
CMD ["npm", "run", "dev"]

