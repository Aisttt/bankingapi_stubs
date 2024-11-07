const express = require('express');
const { faker } = require('@faker-js/faker');
const app = express();
const PORT = process.env.PORT || 6000;

// Middleware для парсинга JSON-запросов
app.use(express.json());

// POST /applications — Создание новой заявки
app.post('/applications', (req, res) => {
    const applicationId = faker.string.uuid(); // Случайный ID заявки
    const { partnerName, partnerApplicationId, creditAmount, creditPeriod } = req.body;

    res.status(201).json({
        applicationId,
        status: "created",
        partnerName: partnerName || faker.company.name(),
        partnerApplicationId: partnerApplicationId || faker.string.uuid(),
        creditAmount: creditAmount || faker.number.int({ min: 10000, max: 500000 }),
        creditPeriod: creditPeriod || faker.number.int({ min: 12, max: 60 }),
        creationDate: new Date().toISOString(),
        message: "Заявка успешно создана"
    });
});

// GET /applications/:applicationId — Получение статуса заявки
app.get('/applications/:applicationId', (req, res) => {
    const { applicationId } = req.params;
    const statuses = ["approved", "pending", "rejected"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]; // Случайный статус

    res.json({
        applicationId,
        status: randomStatus,
        updateDate: faker.date.recent().toISOString(),
        message: `Текущий статус заявки: ${randomStatus}`
    });
});

// PATCH /applications/:applicationId — Обновление статуса заявки
app.patch('/applications/:applicationId', (req, res) => {
    const { applicationId } = req.params;
    const { status } = req.body; // предполагается, что статус будет обновлен
    const updatedStatus = status || "updated";

    res.json({
        applicationId,
        status: updatedStatus,
        updateDate: new Date().toISOString(),
        message: `Статус заявки обновлен на: ${updatedStatus}`
    });
});

// Обработка всех неизвестных маршрутов
app.use((req, res) => {
    res.status(404).json({ message: "Маршрут не найден" });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Mock API сервер запущен на порту ${PORT}`);
});
