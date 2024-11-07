const express = require('express');
const { faker } = require('@faker-js/faker');
const app = express();
const PORT = process.env.PORT || 3000; // Порт для новой заглушки

app.use(express.json());

// Создание согласия на проведение платежа
app.post('/payment-consents', (req, res) => {
    const consentId = faker.string.uuid();
    res.status(201).json({
        Data: {
            consentId,
            creationDateTime: new Date().toISOString(),
            status: "Authorised",
            statusUpdateDateTime: new Date().toISOString(),
            cutOffDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            expectedExecutionDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            expectedSettlementDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            Charges: [
                {
                    chargeBearer: "CRED",
                    type: "BRKF",
                    Amount: {
                        amount: "100.00",
                        currency: "RUB"
                    }
                }
            ]
        },
        Risk: {
            paymentContextCode: "EcommerceGoods"
        },
        Links: {
            self: `/payment-consents/${consentId}`
        },
        Meta: {
            totalPages: 1
        }
    });
});

// Получение статуса согласия по его ID
app.get('/payment-consents/:consentId', (req, res) => {
    const { consentId } = req.params;
    res.status(200).json({
        Data: {
            consentId,
            creationDateTime: new Date().toISOString(),
            status: "Authorised",
            statusUpdateDateTime: new Date().toISOString()
        },
        Risk: {
            paymentContextCode: "EcommerceGoods"
        },
        Links: {
            self: `/payment-consents/${consentId}`
        },
        Meta: {}
    });
});

// Инициирование платежа
app.post('/payments', (req, res) => {
    const paymentId = faker.string.uuid();
    res.status(201).json({
        Data: {
            paymentId,
            consentId: req.body.Data.consentId || faker.string.uuid(),
            creationDateTime: new Date().toISOString(),
            status: "Pending",
            statusUpdateDateTime: new Date().toISOString(),
            expectedExecutionDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            expectedSettlementDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        Risk: {
            paymentContextCode: "EcommerceGoods"
        },
        Links: {
            self: `/payments/${paymentId}`
        },
        Meta: {
            totalPages: 1
        }
    });
});

// Получение информации о платеже по его ID
app.get('/payments/:paymentId', (req, res) => {
    const { paymentId } = req.params;
    res.status(200).json({
        Data: {
            paymentId,
            consentId: faker.string.uuid(),
            creationDateTime: new Date().toISOString(),
            status: "AcceptedSettlementCompleted",
            statusUpdateDateTime: new Date().toISOString(),
            expectedExecutionDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            expectedSettlementDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        Risk: {
            paymentContextCode: "EcommerceGoods"
        },
        Links: {
            self: `/payments/${paymentId}`
        },
        Meta: {}
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
