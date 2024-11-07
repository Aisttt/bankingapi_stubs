const express = require('express');
const { faker } = require('@faker-js/faker');
faker.locale = 'ru';  // Устанавливаем локаль на русский
const app = express();

const PORT = 5003;

app.use(express.json());

// Middleware для генерации заголовков ограничения вызовов
function generateRateLimitHeaders() {
  return {
    "X-RateLimit-Limit": faker.number.int({ min: 100, max: 500 }),
    "X-RateLimit-Remaining": faker.number.int({ min: 0, max: 100 }),
    "X-RateLimit-Reset": Date.now() + faker.number.int({ min: 1000, max: 5000 }),
    "X-Generator": "Mock-Server-RU"
  };
}

// POST /products - получение списка продуктов
app.post('/products', (req, res) => {
  res.set(generateRateLimitHeaders());
  res.status(200).json({
    accounts: [
      {
        entityName: "Счёт",
        alias: "Мой счёт",
        publicId: faker.string.uuid(),
        productType: "ACCOUNT",
        balance: {
          amount: faker.finance.amount(0, 100000, 2),
          currency: { code: "RUB", name: "Российский рубль" }
        }
      }
    ],
    cards: [
      {
        entityName: "Карта",
        alias: "Моя карта",
        publicId: faker.string.uuid(),
        productType: "CARD",
        balance: {
          amount: faker.finance.amount(0, 50000, 2),
          currency: { code: "RUB", name: "Российский рубль" }
        }
      }
    ]
  });
});

// POST /phones/info - получение параметров оператора по номеру
app.post('/phones/info', (req, res) => {
  res.set(generateRateLimitHeaders());
  res.status(200).json({
    number: req.body.number || `+7${faker.phone.number('9##-###-##-##')}`,
    paymentOptions: {
      paySumLimit: {
        minSum: { amount: 50, currency: { code: "RUB" } },
        maxSum: { amount: 15000, currency: { code: "RUB" } }
      },
      recommendedSums: [
        { amount: 100, currency: { code: "RUB" } },
        { amount: 500, currency: { code: "RUB" } },
        { amount: 1000, currency: { code: "RUB" } }
      ]
    },
    serviceProvider: {
      id: faker.string.numeric(5),
      name: faker.helpers.arrayElement(["МТС", "МегаФон", "Билайн", "Tele2"]),
      type: "CONTRACT",
      shortName: faker.helpers.arrayElement(["МТС", "МегаФон", "Билайн", "Tele2"])
    }
  });
});

// POST /payments/request - запрос на оплату
app.post('/payments/request', (req, res) => {
    const { paySum } = req.body;

    if (!paySum || typeof paySum !== 'object' || typeof paySum.amount !== 'number' || !paySum.currency || typeof paySum.currency.code !== 'string') {
        return res.status(400).json({
            error: "Некорректные данные. Поля paySum.amount и paySum.currency обязательны."
        });
    }

    res.json({
        status: "success",
        message: "Запрос на оплату мобильного номера принят",
        transactionId: faker.string.uuid(),  // Убедитесь, что используется faker.string.uuid()
        amount: paySum.amount,
        currency: paySum.currency.code
    });
});
// POST /payments/confirm - подтверждение оплаты
app.post('/payments/confirm', (req, res) => {
  res.set(generateRateLimitHeaders());
  res.status(200).json({
    status: { code: "200", message: "Оплата подтверждена" },
    payment: {
      id: req.body.id,
      description: "Оплата мобильной связи",
      status: "EXECUTED"
    },
    approve: {
      code: {
        lifeTime: "600"
      }
    }
  });
});

// Эндпоинт /payments/start
app.post('/payments/start', (req, res) => {
    const response = {
        paymentOptions: {
            paySumLimit: {
                minSum: {
                    amount: 10,
                    currency: "RUB"
                },
                maxSum: {
                    amount: 15000,
                    currency: "RUB"
                }
            },
            recommendedSums: [
                {
                    amount: 100,
                    currency: "RUB"
                },
                {
                    amount: 500,
                    currency: "RUB"
                }
            ]
        },
        mobileNumber: {
            validFormats: ["+79XXXXXXXXX"]
        }
    };
    res.status(200).json(response);
});

// GET /payments/{paymentId} - запрос детальной информации по платежу
app.get('/payments/:paymentId', (req, res) => {
  res.set(generateRateLimitHeaders());
  res.status(200).json({
    id: req.params.paymentId,
    documentId: faker.string.numeric(10),
    status: "EXECUTED",
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    description: "Оплата мобильной связи",
    mobileNumber: { number: `+7${faker.phone.number('9##-###-##-##')}` },
    paySum: { amount: faker.finance.amount(50, 10000, 2), currency: { code: "RUB" } },
    totalSum: { amount: faker.finance.amount(50, 10000, 2), currency: { code: "RUB" } },
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

// GET /payments/{paymentId}/check - получение чека по платежу
app.get('/payments/:paymentId/check', (req, res) => {
  res.set(generateRateLimitHeaders());
  res.status(200).json({
    pdf: faker.string.alphanumeric(5000) // Чек в виде base64 строки
  });
});

// Обработка неизвестных маршрутов
app.use((req, res) => {
  res.status(404).json({ message: "Маршрут не найден" });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Mock API сервер запущен на порту ${PORT}`);
});
