const express = require('express');
const { faker } = require('@faker-js/faker');
faker.locale = 'ru';
const app = express();
const PORT = 5014;

app.use(express.json());

app.post('/vrp-consents', (req, res) => {
    const response = {
        consentId: faker.string.uuid(),
        status: 'PENDING',
        createdAt: faker.date.recent().toISOString(),
        description: `Описание согласия для ${faker.company.name()}`,
    };
    res.status(200).json(response);
});

// Заглушка для получения ресурса согласия по ID
app.get('/vrp-consents/:consentId', (req, res) => {
    res.status(200).json({
        Data: {
            consentId: req.params.consentId,
            creationDateTime: new Date().toISOString(),
            status: "Authorised",
            statusUpdateDateTime: new Date().toISOString(),
            ControlParameters: {},
            Initiation: {},
            DebtorAccount: {}
        },
        Risk: {},
        Links: { self: faker.internet.url() },
        Meta: {}
    });
});

// Заглушка для удаления согласия по ID
app.delete('/vrp-consents/:consentId', (req, res) => {
    res.status(204).send();
});

// Подтверждение наличия средств по ID согласия
app.post('/vrp-consents/:consentId/funds-confirmation', (req, res) => {
    const response = {
        Data: {
            consentId: req.params.consentId,
            reference: faker.string.uuid(),
            InstructedAmount: {
                amount: "1000.00",
                currency: "RUB"
            }
        }
    };
    res.status(200).json(response);
});

// Инициирование платежа
app.post('/vrp-payments', (req, res) => {
    const response = {
        Data: {
            paymentId: faker.string.uuid(),
            status: "Accepted",
            creationDateTime: faker.date.recent().toISOString(),
            instructionIdentification: faker.string.uuid(),
            endToEndIdentification: "E2ERef12345",
            instructedAmount: {
                amount: "500.00",
                currency: "RUB"
            }
        }
    };
    res.status(201).json(response);
});

// Получение состояния перевода по ID
app.get('/vrp-payments/:VRPId', (req, res) => {
    const response = {
        Data: {
            paymentId: req.params.VRPId,
            status: "Completed",
            completionDateTime: faker.date.recent().toISOString(),
            instructedAmount: {
                amount: "500.00",
                currency: "RUB"
            }
        }
    };
    res.status(200).json(response);
});

// Получение детальной информации по ID перевода
app.get('/vrp-payments/:VRPId/payment-details', (req, res) => {
    const response = {
        Data: {
            paymentId: req.params.VRPId,
            creditorAccount: {
                schemeName: "RU.CBR.BBAN",
                identification: "40817810621234567890",
                name: faker.company.name()
            },
            instructedAmount: {
                amount: "500.00",
                currency: "RUB"
            },
            status: "Completed",
            endToEndIdentification: "E2ERef12345",
            instructionIdentification: faker.string.uuid()
        }
    };
    res.status(200).json(response);
});

app.listen(PORT, () => {
    console.log(`Mock API server is running on port ${PORT}`);
});
