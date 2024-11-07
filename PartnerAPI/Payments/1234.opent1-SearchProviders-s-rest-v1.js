const express = require('express');
const { faker } = require('@faker-js/faker');
faker.locale = 'ru';

const app = express();
const port = 3010;

app.use(express.json());

// Заглушка для поиска услуг по фильтрам
app.get('/catalog/operations', (req, res) => {
    const { pageNumber = 0, pageSize = 10 } = req.query;

    const items = Array.from({ length: pageSize }, () => ({
        id: faker.datatype.uuid(),
        name: "Услуга " + faker.company.name(),
        operationCode: faker.random.alphaNumeric(10).toUpperCase(),
        productId: faker.datatype.uuid(),
        type: "CONTRACT",
        subTypes: ["MOBILE_BY_PHONE"],
        description: "Описание услуги",
        receiver: {
            inn: faker.finance.account(12),
            kpp: faker.finance.account(9),
            account: faker.finance.account(20),
            bank: {
                name: "ВТБ",
                bic: "044525187"
            }
        },
        actions: [
            { key: "PAYMENT", systemId: "MS" },
            { key: "TEMPLATE", systemId: "MINERVA" }
        ],
        categoryIds: ["1", "2"],
        regionIds: ["77", "78"],
        pmntSettings: {
            acceptanceKey: "ACCEPTANCE_KEY",
            clientAuthTypePayAvailable: true
        }
    }));

    res.status(200).json({
        items,
        pageNumber: parseInt(pageNumber, 10),
        pageSize: parseInt(pageSize, 10),
        total: 100,
        hasMore: true
    });
});

// Пример эндпоинта с использованием faker для генерации данных
app.get('/catalog/operations/:id', (req, res) => {
    const id = req.params.id;
    res.json({
        id: id,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.alphanumeric(10), // Генерация алфавитно-цифровой строки
    });
});

// Другой эндпоинт
app.get('/catalog/operations/list', (req, res) => {
    const ids = req.query.ids.split(',');
    const data = ids.map(id => ({
        id: id,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.alphanumeric(10), // Генерация алфавитно-цифровой строки
    }));
    res.json(data);
});

app.get('/catalog/categories', (req, res) => {
    res.json({
        categoryId: faker.string.uuid(), // Генерация UUID
        name: faker.commerce.department(),
        description: faker.commerce.productDescription(),
        code: faker.string.alphanumeric(10) // Генерация алфавитно-цифровой строки
    });
});

// Обработка всех неизвестных маршрутов
app.use((req, res) => {
    res.status(404).json({ message: "Маршрут не найден" });
});


// Запуск сервера
app.listen(port, () => {
    console.log(`Mock API сервер запущен на порту ${port}`);
});
