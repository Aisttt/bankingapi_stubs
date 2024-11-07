const express = require('express');
const { faker } = require('@faker-js/faker');
const app = express();
const PORT = 5012;

app.use(express.json());

// 1. Получение информации о лидах
app.get('/leads', (req, res) => {
    let leadId = req.query.leadId;

    // Преобразуем leadId в массив, если он не является массивом
    if (leadId && !Array.isArray(leadId)) {
        leadId = [leadId];
    }

    const response = {
        leads: leadId ? leadId.map(id => ({
            leadId: id,
            sourceLeadId: faker.string.alphanumeric(8), // исправлено на новый метод
            status: faker.helpers.arrayElement(['New', 'Processing', 'ProductOpened', 'Rejected']),
            statusChanged: faker.date.recent().toISOString(),
            responseCode: 'SUCCESS',
            responseCodeDescription: 'Операция выполнена успешно.'
        })) : []
    };

    res.status(200).json(response);
});


// 2. Добавление лидов
app.post('/leads_impersonal', (req, res) => {
    const { leads } = req.body;

    if (!leads || !Array.isArray(leads) || leads.length === 0) {
        return res.status(400).json({
            error: "Отсутствует массив 'leads' или он пуст."
        });
    }

    const response = {
        leads: leads.map(lead => ({
            sourceLeadId: lead.sourceLeadId || faker.string.alphaNumeric(8),
            leadId: faker.number.int({ min: 1, max: 9007199254740991 }), // Генерация случайного числового ID
            status: faker.helpers.arrayElement(['New', 'VerificationFailed', 'Duple', 'Processing']),
            responseCode: 'SUCCESS',
            responseCodeDescription: 'Лид успешно добавлен'
        }))
    };

    res.status(200).json(response);
});

// 3. Проверка лидов
app.post('/check_leads', (req, res) => {
    const { leads } = req.body;

    if (!leads || !Array.isArray(leads) || leads.length === 0) {
        return res.status(400).json({
            error: "Отсутствует массив 'leads' или он пуст."
        });
    }

    const response = {
        leads: leads.map(lead => ({
            inn: lead.inn || faker.number.int({ min: 1000000000, max: 9999999999 }).toString(), // Генерация 10-значного ИНН
            productCode: lead.productCode || faker.string.alphaNumeric(5).toUpperCase(),
            city: lead.city || 'Москва',
            region: lead.region || 'Московская область',
            responseCode: faker.helpers.arrayElement(['POSITIVE', 'NEGATIVE']),
            responseCodeDescription: 'Проверка лида выполнена успешно'
        }))
    };

    res.status(200).json(response);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Mock API сервер запущен на порту ${PORT}`);
});
