# Используем Node.js в качестве базового образа
FROM node:16

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости с помощью npm
RUN npm install

# Копируем все файлы заглушек
COPY ./OpenAPI /app/OpenAPI
COPY ./PartnerAPI /app/PartnerAPI

# Переменная окружения PORT для указания, какой порт будет слушать заглушка
ARG PORT=3000
ENV PORT=${PORT}

# Открываем порт для взаимодействия
EXPOSE ${PORT}

# Команда для запуска заглушки, по умолчанию запускается `npm start`
# Но её можно переопределить через docker-compose
CMD ["npm", "start"]
