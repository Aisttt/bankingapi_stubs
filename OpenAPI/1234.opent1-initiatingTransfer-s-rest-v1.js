const express = require('express');
const { faker } = require('@faker-js/faker');
const app = express();
const PORT = 3001; // Порт для заглушки

app.use(express.json());

// 1. Создание ресурса согласия на доступ к счету
app.post('/account-consents', (req, res) => {
    res.status(201).json({
        Data: {
            consentId: `urn-alphabank-intent-${faker.string.uuid()}`,
            status: 'AwaitingAuthorisation',
            statusUpdateDateTime: new Date().toISOString(),
            creationDateTime: new Date().toISOString(),
            permissions: req.body.permissions || ['ReadAccountsBasic', 'ReadTransactionsDebits', 'ReadBalances'],
            expirationDateTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            transactionFromDateTime: req.body.transactionFromDateTime || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            transactionToDateTime: req.body.transactionToDateTime || new Date().toISOString()
        },
        Links: {
            self: `https://api.bankingapi.ru/extapi/aft/clientInfo/hackathon/v1/account-consents/${faker.string.uuid()}`
        },
        Meta: {
            totalPages: '1'
        }
    });
});

// 2. Получение ресурса согласия по ID
app.get('/account-consents/:consentId', (req, res) => {
    const { consentId } = req.params;
    res.json({
        Data: {
            consentId,
            status: 'Authorised',
            statusUpdateDateTime: new Date().toISOString(),
            creationDateTime: new Date().toISOString(),
            permissions: ['ReadAccountsBasic', 'ReadTransactionsDebits', 'ReadBalances'],
            expirationDateTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            transactionFromDateTime: '2023-01-01T00:00:00+00:00',
            transactionToDateTime: '2023-12-31T23:59:59+00:00'
        },
        Links: {
            self: `https://api.bankingapi.ru/extapi/aft/clientInfo/hackathon/v1/account-consents/${consentId}`
        },
        Meta: { totalPages: '1' }
    });
});

// 3. Получение поручения на извлечение ресурса согласия
app.get('/account-consents/:consentId/retrieval-grant', (req, res) => {
    const { consentId } = req.params;
    res.json({
        Data: {
            consentId,
            retrievalGrantId: faker.string.uuid(),
            status: 'Granted',
            grantExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        Links: {
            self: `https://api.bankingapi.ru/extapi/aft/clientInfo/hackathon/v1/account-consents/${consentId}/retrieval-grant`
        },
        Meta: {}
    });
});

// 4. счета

app.get('/accounts', (req, res) => {
    res.status(200).json({
        Data: {
            Account: [
                {
                    accountId: faker.string.uuid(),
                    status: 'Enabled',
                    currency: 'RUB',
                    accountType: 'Personal',
                    accountSubType: 'CurrentAccount',
                    schemeName: 'RU.CBR.AccountNumber',
                    identification: faker.string.numeric(20),
                    name: 'Основной текущий счет'
                }
            ]
        },
        Links: {
            self: 'https://api.bankingapi.ru/extapi/aft/clientInfo/hackathon/v1/accounts'
        },
        Meta: { totalPages: '1' }
    });
});


// Конечная точка для получения детальной информации о счете по accountId
app.get('/accounts/:accountId', (req, res) => {
    const { accountId } = req.params;
    res.status(200).json({
        Data: {
            accountId,
            status: 'Enabled',
            currency: 'RUB',
            accountType: 'Personal',
            accountSubType: 'CurrentAccount',
            schemeName: 'RU.CBR.AccountNumber',
            identification: faker.string.numeric(20), // Номер счета (20-значный номер)
            name: 'Основной текущий счет'
        },
        Links: {
            self: `https://api.bankingapi.ru/extapi/aft/clientInfo/hackathon/v1/accounts/${accountId}`
        },
        Meta: {}
    });
});

// Получение баланса по конкретному счёту
app.get('/accounts/:accountId/balance', (req, res) => {
    const { accountId } = req.params;
    res.json({
        Data: {
            accountId,
            balance: {
                amount: {
                    currency: 'RUB',
                    amount: faker.finance.amount()
                },
                creditDebitIndicator: 'Credit',
                type: 'ClosingAvailable'
            }
        },
        Links: {
            self: `https://api.bankingapi.ru/extapi/aft/clientInfo/hackathon/v1/accounts/${accountId}/balance`
        },
        Meta: {}
    });
});

// 7. Получение списка транзакций по счету
app.get('/accounts/:accountId/transactions', (req, res) => {
    const { accountId } = req.params;
    res.json({
        Data: {
            accountId,
            transactions: Array.from({ length: 5 }, () => ({
                transactionId: faker.string.uuid(),
                bookingDate: faker.date.past().toISOString(),
                amount: {
                    currency: 'RUB',
                    amount: faker.finance.amount()
                },
                transactionType: 'DirectDebit',
                transactionDescription: faker.lorem.sentence()
            }))
        },
        Links: {
            self: `https://api.bankingapi.ru/extapi/aft/clientInfo/hackathon/v1/accounts/${accountId}/transactions`
        },
        Meta: { totalPages: '1' }
    });
});

// 8. Получение балансов по всем авторизованным счетам
app.get('/balances', (req, res) => {
    res.json({
        Data: {
            Balance: [
                {
                    accountId: faker.string.uuid(),
                    amount: {
                        currency: 'RUB',
                        amount: faker.finance.amount()
                    },
                    creditDebitIndicator: 'Credit',
                    type: 'ClosingAvailable'
                }
            ]
        },
        Links: {
            self: 'https://api.bankingapi.ru/extapi/aft/clientInfo/hackathon/v1/balances'
        },
        Meta: { totalPages: '1' }
    });
});

// 9. Получение транзакции по идентификатору accountId
app.get('/accounts/:accountId/transaction', (req, res) => {
    const { accountId } = req.params;
    res.json({
        Data: {
            transactionId: faker.string.uuid(),
            accountId,
            bookingDate: faker.date.past().toISOString(),
            amount: {
                currency: 'RUB',
                amount: faker.finance.amount()
            },
            transactionType: 'DirectDebit',
            transactionDescription: faker.lorem.sentence()
        },
        Links: {
            self: `https://api.bankingapi.ru/extapi/aft/clientInfo/hackathon/v1/accounts/${accountId}/transaction`
        },
        Meta: {}
    });
});

// Отзыв согласия на доступ к счету
app.delete('/account-consents/:consentId', (req, res) => {
    const { consentId } = req.params;
    res.status(200).json({
        message: `Согласие с ID ${consentId} успешно отозвано`
    });
});

// Список транзакций по всем счетам
app.get('/transactions', (req, res) => {
    res.status(200).json({
        Data: {
            Transaction: [
                {
                    transactionId: faker.string.uuid(),
                    accountId: faker.string.uuid(),
                    amount: faker.finance.amount(),
                    currency: 'RUB',
                    creditDebitIndicator: 'Credit',
                    status: 'Completed',
                    bookingDateTime: faker.date.past(),
                    transactionInformation: 'Пополнение счета'
                },
                {
                    transactionId: faker.string.uuid(),
                    accountId: faker.string.uuid(),
                    amount: faker.finance.amount(),
                    currency: 'RUB',
                    creditDebitIndicator: 'Debit',
                    status: 'Pending',
                    bookingDateTime: faker.date.past(),
                    transactionInformation: 'Оплата услуг'
                }
            ]
        },
        Links: {
            self: '/transactions'
        },
        Meta: { totalPages: '1' }
    });
});

// Выписки по всем авторизованным счетам
app.get('/statements', (req, res) => {
    res.status(200).json({
        Data: {
            Statement: [
                {
                    statementId: faker.string.uuid(),
                    accountId: faker.string.uuid(),
                    startDate: faker.date.past(),
                    endDate: faker.date.recent(),
                    creationDateTime: faker.date.recent(),
                    status: 'Available'
                }
            ]
        },
        Links: {
            self: '/statements'
        },
        Meta: { totalPages: '1' }
    });
});

// Получение выписки по идентификатору
app.get('/accounts/:accountId/statements/:statementId', (req, res) => {
    const { accountId, statementId } = req.params;
    res.status(200).json({
        Data: {
            statementId,
            accountId,
            startDate: faker.date.past(),
            endDate: faker.date.recent(),
            creationDateTime: faker.date.recent(),
            status: 'Available',
            transactionList: [
                {
                    transactionId: faker.string.uuid(),
                    amount: faker.finance.amount(),
                    currency: 'RUB',
                    creditDebitIndicator: 'Credit',
                    bookingDateTime: faker.date.past(),
                    transactionInformation: 'Зачисление средств'
                },
                {
                    transactionId: faker.string.uuid(),
                    amount: faker.finance.amount(),
                    currency: 'RUB',
                    creditDebitIndicator: 'Debit',
                    bookingDateTime: faker.date.past(),
                    transactionInformation: 'Снятие средств'
                }
            ]
        },
        Links: {
            self: `/accounts/${accountId}/statements/${statementId}`
        },
        Meta: {}
    });
});

app.post('/statements/:accountId', (req, res) => {
    const { accountId } = req.params;
    const { Data, Risk } = req.body;

    // Проверка на обязательные поля
    if (!Data || !Data.Statement || !Data.Statement.accountId || !Data.Statement.fromBookingDateTime || !Data.Statement.toBookingDateTime) {
        return res.status(422).json({
            error: "Data.Statement: Все обязательные поля должны быть указаны, включая accountId, fromBookingDateTime и toBookingDateTime."
        });
    }

    // Генерация случайного statementId
    const statementId = `stmt-${Math.floor(Math.random() * 1000000)}`;

    // Ответ на запрос
    res.json({
        statementId: statementId,
        message: `Выписка для счета ${accountId} успешно создана`,
        Data: {
            accountId: accountId,
            statementId: statementId,
            fromBookingDateTime: Data.Statement.fromBookingDateTime,
            toBookingDateTime: Data.Statement.toBookingDateTime,
        },
        Risk: Risk || {} // Включаем Risk, если он был передан
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
