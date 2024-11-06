const express = require('express');
const { faker } = require('@faker-js/faker');
const app = express();

const PORT = 5001;

app.use(express.json());

// Middleware для заголовков ограничения вызовов
function generateRateLimitHeaders() {
  return {
    "X-RateLimit-Limit": faker.number.int({ min: 100, max: 500 }),
    "X-RateLimit-Remaining": faker.number.int({ min: 0, max: 100 }),
    "X-RateLimit-Reset": Date.now() + faker.number.int({ min: 1000, max: 5000 }),
    "X-Generator": "Mock-Server"
  };
}

// Получение реквизитов карты — путь без префикса
app.get('/credentials/:publicId', (req, res) => {
  res.set(generateRateLimitHeaders());
  res.status(200).json({
    encryptedPan: faker.finance.creditCardNumber(),
    cardExpiry: `${faker.date.future().getMonth() + 1}/${String(faker.date.future().getFullYear()).slice(-2)}`,
    embossingName: faker.name.fullName().toUpperCase()
  });
});

// Получение CVV — путь без префикса
app.get('/cvv/:publicId', (req, res) => {
  res.set(generateRateLimitHeaders());
  res.status(200).json({
    Cvv: faker.string.numeric(3)
  });
});

// Токенизация карты — путь без префикса
app.post('/token/:publicId', (req, res) => {
  const { callId, inputParameters, mobilePayService, sessionId } = req.body;

  if (!callId || !inputParameters || !mobilePayService || !sessionId) {
    return res.status(400).json({ error: "Поля callId, inputParameters, mobilePayService и sessionId обязательны" });
  }

  res.set(generateRateLimitHeaders());
  res.status(200).json({
    tokens: inputParameters.map(param => ({
      name: param.name,
      value: faker.string.alphanumeric(16)
    }))
  });
});

// Получение токенов карты — путь без префикса
app.get('/tokens/:publicId', (req, res) => {
  res.set(generateRateLimitHeaders());
  res.status(200).json({
    tokens: Array.from({ length: 3 }, () => ({
      name: faker.finance.transactionType(),
      value: faker.string.alphanumeric(16)
    }))
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

