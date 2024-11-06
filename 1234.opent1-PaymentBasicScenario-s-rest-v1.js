const express = require('express');
const { faker } = require('@faker-js/faker');
const app = express();
faker.locale = 'ru';

const PORT = 5006;

app.use(express.json());

// Middleware для генерации заголовков ограничения вызовов
function generateRateLimitHeaders() {
  return {
    "X-RateLimit-Limit": faker.number.int({ min: 100, max: 500 }),
    "X-RateLimit-Remaining": faker.number.int({ min: 0, max: 100 }),
    "X-RateLimit-Reset": Date.now() + faker.number.int({ min: 1000, max: 5000 }),
    "X-Generator": "Mock-Server-RU"
  };
};

// GET /payments/{paymentId} - Запрос деталей платежа
app.get('/payments/:paymentId', (req, res) => {
  res.set(generateRateLimitHeaders());
  res.status(200).json({
    id: req.params.paymentId,
    documentId: faker.string.numeric(10),
    createdAt: faker.date.past().toISOString(),
    description: "Универсальный платеж",
    paySum: { amount: 1000, currency: { code: "RUB" } },
    commissionSum: { amount: 50, currency: { code: "RUB" } },
    totalSum: { amount: 1050, currency: { code: "RUB" } },
    status: { code: "PROCESSING", description: "Платеж в обработке" },
    clientProduct: { publicId: faker.string.uuid(), productType: "ACCOUNT" },
    providerService: { id: "1", name: "КИВИ", type: "CONTRACT" },
    actions: {
      repeat: true,
      check: true,
      remind: true,
      template: true,
      autoPaymentByDate: true,
      autoPaymentByBalance: true
    }
  });
});

// GET /products - Список доступных продуктов для оплаты
app.get('/products', (req, res) => {
  res.set(generateRateLimitHeaders());
  res.status(200).json({
    accounts: [
      {
        publicId: faker.string.uuid(),
        productType: "ACCOUNT",
        balance: { amount: 5000, currency: { code: "RUB" } }
      }
    ],
    cards: [
      {
        publicId: faker.string.uuid(),
        productType: "CARD",
        balance: { amount: 3000, currency: { code: "RUB" } }
      }
    ]
  });
});

// POST /payments/request - Запрос на создание универсального платежа
app.post('/payments/request', (req, res) => {
  const { clientProduct, providerService, paySum } = req.body;
  
  if (!clientProduct || !providerService || !paySum) {
    return res.status(400).json({
      errors: [
        { code: "INVALID_REQUEST", message: "Обязательные поля отсутствуют." }
      ]
    });
  }
  
  res.set(generateRateLimitHeaders());
  res.status(200).json({
    payment: {
      id: faker.string.uuid(),
      clientProduct,
      fields: req.body.fields || [],
      paySum,
      commissionSum: { amount: 50, currency: { code: "RUB" } },
      totalSum: { amount: paySum.amount + 50, currency: { code: "RUB" } },
    }
  });
});

// POST /payments/confirm - Подтверждение платежа
app.post('/payments/confirm', (req, res) => {
  const { paymentId, clientConfirm } = req.body;
  
  if (!paymentId || !clientConfirm) {
    return res.status(400).json({
      errors: [
        { code: "INVALID_REQUEST", message: "Обязательные поля отсутствуют." }
      ]
    });
  }
  
  res.set(generateRateLimitHeaders());
  res.status(200).json({
    payment: {
      id: paymentId,
      status: { code: "EXECUTED", description: "Платеж выполнен" }
    }
  });
});

// GET /payments/{paymentId}/check - Получение чека по платежу
app.get('/payments/:paymentId/check', (req, res) => {
  res.set(generateRateLimitHeaders());
  res.status(200).json({
    pdf: faker.string.alphanumeric(5000) // Чек в формате base64
  });
});

app.post('/payments/start', (req, res) => {
    const response = {
        fields: [
            {
                key: 'phone',
                name: 'Номер телефона',
                description: 'Введите номер телефона для платежа',
                type: 'MOBILE_PHONE',
                value: faker.phone.number('+7 (###) ###-##-##'),
                required: true,
                editable: true
            },
            {
                key: 'accountNumber',
                name: 'Номер счёта',
                description: 'Введите номер счёта',
                type: 'STRING',
                value: faker.string.numeric(10), // Генерируем 10-значный номер счета
                required: true,
                editable: true
            }
        ],
        paySum: {
            payLimit: {
                min: { amount: 100, currency: { code: 'RUB' } },
                max: { amount: 100000, currency: { code: 'RUB' } }
            },
            recommendedSums: [
                { amount: 100, currency: { code: 'RUB' } },
                { amount: 500, currency: { code: 'RUB' } },
                { amount: 1000, currency: { code: 'RUB' } }
            ]
        }
    };

    res.status(200).json(response);
});

// Обработка неизвестных маршрутов
app.use((req, res) => {
  res.status(404).json({ message: "Маршрут не найден" });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Mock API сервер запущен на порту ${PORT}`);
});
