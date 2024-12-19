# Этап 1: Сборка
FROM node:18-alpine AS builder

# Установим рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальной исходный код
COPY . .

# Собираем проект
RUN npm run build

# Этап 2: Запуск
FROM node:18-alpine AS runner

# Установим рабочую директорию
WORKDIR /app

# Установим переменные окружения
ENV NODE_ENV=production
ENV PORT=3000

# Копируем только необходимые файлы из этапа сборки
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./

# Экспонируем порт
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]
