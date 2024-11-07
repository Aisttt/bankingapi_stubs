const express = require('express');
const { faker } = require('@faker-js/faker');
const app = express();

const PORT = process.env.PORT || 3009;

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

// GET /charges - Поиск начислений по штрафам ГИБДД по СТС или ВУ
app.get('/charges', (req, res) => {
  const { sts, vu } = req.query;
  
  res.set(generateRateLimitHeaders());
  if (!sts && !vu) {
    return res.status(400).json({
      error: "Параметры sts или vu обязательны для поиска начислений."
    });
  }

  res.status(200).json({
    items: [
      {
        uin: faker.string.numeric(20),
        details: {
          violation: {
            violationAt: faker.date.past(),
            address: "МОСКВА, УЛ. ТВЕРСКАЯ, 10"
          },
          ruling: {
            title: "Постановление о штрафе",
            lawArticle: "12.09.2",
            rulingAt: faker.date.past(),
            entryForceAt: faker.date.recent()
          },
          payment: {
            paySum: { amount: 1000, currency: { code: "RUB" } }
          }
        }
      }
    ],
    pageNumber: req.query.pageNumber || 0,
    pageSize: req.query.pageSize || 30,
    total: 1,
    hasMore: false
  });
});

// GET /charges/{uin} - Поиск начисления по УИН
app.get('/charges/:uin', (req, res) => {
  res.set(generateRateLimitHeaders());

  res.status(200).json({
    uin: req.params.uin,
    details: {
      violation: {
        violationAt: faker.date.past(),
        address: "МОСКОВСКАЯ ОБЛ. А/Д М-3 «УКРАИНА», 78КМ"
      },
      ruling: {
        title: "Постановление №18810150200605213474",
        lawArticle: "12.09.2",
        rulingAt: faker.date.past(),
        entryForceAt: faker.date.recent()
      },
      payment: {
        paySum: { amount: 1000, currency: { code: "RUB" } }
      }
    }
  });
});

// GET /products - Список продуктов клиента
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

// POST /payments/request - Запрос на оплату штрафа
app.post('/payments/request', (req, res) => {
  const { clientProduct, uin } = req.body;
  res.set(generateRateLimitHeaders());

  if (!clientProduct || !uin) {
    return res.status(400).json({
      errors: [
        {
          code: "INVALID_REQUEST",
          message: "Поля clientProduct и uin обязательны."
        }
      ]
    });
  }

  res.status(200).json({
    status: { code: "NEED_CONFIRM", description: "Необходимо подтверждение" },
    payment: {
      id: faker.string.uuid(),
      description: `Оплата штрафа по УИН ${uin}`,
      paySum: { amount: 1000, currency: { code: "RUB" } }
    }
  });
});

// POST /payments/confirm - Подтверждение оплаты
app.post('/payments/confirm', (req, res) => {
  const { id, clientConfirm } = req.body;
  res.set(generateRateLimitHeaders());

  if (!id || !clientConfirm) {
    return res.status(400).json({
      errors: [
        {
          code: "INVALID_REQUEST",
          message: "Поля id и clientConfirm обязательны."
        }
      ]
    });
  }

  res.status(200).json({
    status: { code: "ACCEPT", description: "Платеж подтвержден" },
    payment: {
      id: id,
      description: "Оплата штрафа",
      status: "EXECUTED"
    }
  });
});

// GET /payments/{paymentId} - Получение детальной информации о платеже
app.get('/payments/:paymentId', (req, res) => {
  res.set(generateRateLimitHeaders());

  res.status(200).json({
    id: req.params.paymentId,
    documentId: faker.string.numeric(10),
    status: "EXECUTED",
    createdAt: faker.date.past(),
    description: "Оплата штрафа по УИН",
    paySum: { amount: 1000, currency: { code: "RUB" } }
  });
});

// GET /payments/check/{paymentId} - Получение чека по платежу
app.get('/payments/check/:paymentId', (req, res) => {
  res.set(generateRateLimitHeaders());

  res.status(200).json({
    pdf: faker.string.alphanumeric(5000) // Чек в формате base64
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
