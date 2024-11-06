const express = require('express');
const { faker } = require('@faker-js/faker');
const app = express();

const PORT = 5004;

app.use(express.json());

// Middleware для заголовков ограничения вызовов
function generateRateLimitHeaders() {
  return {
    "X-RateLimit-Limit": faker.number.int({ min: 100, max: 500 }),
    "X-RateLimit-Remaining": faker.number.int({ min: 0, max: 100 }),
    "X-RateLimit-Reset": Date.now() + faker.number.int({ min: 1000, max: 5000 }),
    "X-Generator": "Mock-Server-RU"
  };
}

// GET /cards/accounts/external/{externalAccountID}/rewards/balance - Получить баланс вознаграждений
app.get('/cards/accounts/external/:externalAccountID/rewards/balance', (req, res) => {
  const { externalAccountID } = req.params;
  res.set(generateRateLimitHeaders());
  
  res.status(200).json({
    data: {
      redemptionEligibility: true,
      rewardSummary: {
        availableBalance: faker.finance.amount(100, 10000, 2),
        rewardType: "POINTS",
        currencyCode: "RUB"
      },
      programDetail: {
        programId: "A7DV56B",
        description: "Программа выписки по кредиту",
        catalogs: [
          {
            catalogId: "C9AP78DS9K",
            catalogType: "STMTCR",
            conversionRate: 0.01,
            description: "Заявление о погашении кредита",
            minRedeemPoints: 2000,
            maxRedeemPoints: 50000
          }
        ]
      }
    }
  });
});

// POST /cards/accounts/external/{externalAccountID}/rewards/redemption - Списать бонусные баллы
app.post('/cards/accounts/external/:externalAccountID/rewards/redemption', (req, res) => {
  const { externalAccountID } = req.params;
  const { redemptionAmount, catalogId, programId } = req.body.data || {};

  if (!redemptionAmount || !catalogId || !programId) {
    return res.status(400).json({
      errors: [
        {
          id: faker.string.uuid(),
          code: "BAD_REQUEST",
          title: "The request is invalid or not properly formed",
          detail: "Необходимые поля отсутствуют или некорректны"
        }
      ]
    });
  }

  res.set(generateRateLimitHeaders());
  res.status(200).json({
    data: {
      redemptionReferenceNumber: faker.string.uuid(),
      redemptionId: faker.string.uuid(),
      rewardSummary: {
        availableBalance: faker.finance.amount(100, 10000, 2),
        rewardType: "POINTS",
        currencyCode: "RUB"
      }
    }
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
