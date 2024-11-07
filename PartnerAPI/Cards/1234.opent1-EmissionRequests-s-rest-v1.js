const express = require('express');
const { faker } = require('@faker-js/faker');
const app = express();

const PORT = 3004;

app.use(express.json());

// Middleware для генерации заголовков ограничения вызовов
function generateRateLimitHeaders() {
  return {
    "X-RateLimit-Limit": faker.number.int({ min: 100, max: 500 }),
    "X-RateLimit-Remaining": faker.number.int({ min: 0, max: 100 }),
    "X-RateLimit-Reset": Date.now() + faker.number.int({ min: 1000, max: 5000 }),
    "X-Generator": "Mock-Server"
  };
}

// POST /prepaid - Эмиссия карты
app.post('/prepaid', (req, res) => {
  const { partnerId } = req.body;
  
  // Проверка на обязательное поле partnerId
  if (!partnerId) {
    return res.status(400).json({
      error: "Поле partnerId обязательно"
    });
  }
  
  res.set(generateRateLimitHeaders());
  res.status(200).json({
    maskedPan: faker.finance.creditCardNumber('#### #### **** ####'),
    embossingName: faker.name.fullName().toUpperCase(),
    cardExpiry: `${faker.date.future().getMonth() + 1}/${String(faker.date.future().getFullYear()).slice(-2)}`,
    publicId: faker.string.uuid() // Заменили на faker.string.uuid()
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
