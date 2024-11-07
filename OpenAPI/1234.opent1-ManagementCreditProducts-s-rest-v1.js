const express = require('express');
const { faker } = require('@faker-js/faker');

faker.locale = 'ru'; // Устанавливаем локаль на русский

const app = express();
const PORT = 3002;

app.use(express.json());

// Helper function to set required headers
const setResponseHeaders = (res) => {
    res.setHeader('x-fapi-interaction-id', faker.string.uuid());
    res.setHeader('x-fapi-customer-ip-address', faker.internet.ip());
    res.setHeader('x-customer-user-agent', faker.internet.userAgent());
};

// 1. Получение списка доступных банковских продуктов
app.get('/products', (req, res) => {
    const products = [
        {
            productId: '550e8400-e29b-41d4-a716-446655440000',
            productName: 'Кредитная карта "Универсальная"',
            productType: 'creditCard',
            productVersion: '13.201.001-rls',
            Brand: [
                {
                    brandName: 'bankingapi',
                    applicationUri: 'https://bankingapi.ru/products/credit-card/applay'
                }
            ]
        },
        {
            productId: '550e8400-e29b-41d4-a716-446655440001',
            productName: 'Дебетовая карта "Базовая"',
            productType: 'debitCard',
            productVersion: '13.201.001-rls',
            Brand: [
                {
                    brandName: 'bankingapi',
                    applicationUri: 'https://bankingapi.ru/products/debit-card/applay'
                }
            ]
        },
        {
            productId: '550e8400-e29b-41d4-a716-446655440002',
            productName: 'Ипотечный кредит "Жилищный комфорт"',
            productType: 'mortgage',
            productVersion: '13.201.001-rls',
            Brand: [
                {
                    brandName: 'bankingapi',
                    applicationUri: 'https://bankingapi.ru/products/mortgage/applay'
                }
            ]
        },
        {
            productId: '550e8400-e29b-41d4-a716-446655440003',
            productName: 'Потребительский кредит "На любые цели"',
            productType: 'loanIndividual',
            productVersion: '13.201.001-rls',
            Brand: [
                {
                    brandName: 'bankingapi',
                    applicationUri: 'https://bankingapi.ru/products/personal-loan/applay'
                }
            ]
        },
        {
            productId: '550e8400-e29b-41d4-a716-446655440004',
            productName: 'Вклад "Сберегательный"',
            productType: 'depositIndividual',
            productVersion: '13.201.001-rls',
            Brand: [
                {
                    brandName: 'bankingapi',
                    applicationUri: 'https://bankingapi.ru/products/saving-deposit/applay'
                }
            ]
        },
        {
            productId: '550e8400-e29b-41d4-a716-446655440006',
            productName: 'Инвестиционный счёт "Инвестиции+"',
            productType: 'investment',
            productVersion: '13.201.001-rls',
            Brand: [
                {
                    brandName: 'bankingapi',
                    applicationUri: 'https://bankingapi.ru/products/investment-account/applay'
                }
            ]
        },
        {
            productId: '550e8400-e29b-41d4-a716-446655440008',
            productName: 'Автокредит "Лёгкий старт"',
            productType: 'loanCar',
            productVersion: '13.201.001-rls',
            Brand: [
                {
                    brandName: 'bankingapi',
                    applicationUri: 'https://bankingapi.ru/products/auto-loan/applay'
                }
            ]
        }
    ];

    setResponseHeaders(res);
    res.status(200).json({
        Data: { Product: products },
        Links: { self: `https://api.bankingapi.ru/products?page=1` },
        Meta: { totalPages: 1 },
    });
});

// 2. Получение детальной информации о банковском продукте по его ID
app.get('/products/:productId', (req, res) => {
    const productId = req.params.productId;

    let product;
    switch (productId) {
        
        case '550e8400-e29b-41d4-a716-446655440000':
        product = {
            productId: '550e8400-e29b-41d4-a716-446655440000',
            productName: 'Кредитная карта "Универсальная"',
            productType: 'creditCard',
            productVersion: '13.201.001-rls',
            Brand: {
                brandName: 'bankingapi',
                applicationUri: 'https://bankingapi.ru/products/credit-card/apply'
            },
            ProductDetails: {
                active: true,
                activeFrom: '2023-06-05T15:15:13+00:00',
                activeTo: '2025-06-05T15:15:13+00:00',
                feeFreeLength: 3,
                feeFreeLengthPeriod: 'Month',
                productInsurance: true,
                DeliveryRegions: [
                    {
                        comments: [
                            'Доступна по всей территории Российской Федерации'
                        ]
                    }
                ],
                FeatureAndBenefit: [
                    {
                        FeatureAndBenefitGroup: [
                            {
                                name: 'Кэшбэк на покупки',
                                type: 'Cashback',
                                comments: [
                                    'Возврат 5% от суммы покупок'
                                ],
                                benefitGroupNominalValue: '5.00',
                                fee: '0.00',
                                applicationFrequency: 'Monthly'
                            }
                        ],
                        FeatureAndBenefitItem: [
                            {
                                identification: '14ee9bcb-ce8d-407d-b377-d7663c586f73',
                                type: 'Cashback',
                                name: 'Кэшбэк на покупки',
                                comments: [
                                    'Возврат 5% от суммы покупок'
                                ],
                                amount: '5.00',
                                indicator: true,
                                textual: 'Кэшбэк 5% на все покупки'
                            }
                        ]
                    }
                ],
                Eligibility: [
                    {
                        name: 'Возраст от 18 лет',
                        description: 'Клиенты в возрасте от 18 до 65 лет',
                        type: 'NewCustomersOnly',
                        comments: [
                            'Требуется паспорт гражданина РФ'
                        ],
                        amount: '18',
                        indicator: true,
                        textual: 'Возраст от 18 до 65 лет',
                        period: 'Year'
                    }
                ]
            }
        };
        break;

        case '550e8400-e29b-41d4-a716-446655440001':
        product = {
            productId: '550e8400-e29b-41d4-a716-446655440001',
            productName: 'Дебетовая карта "Базовая"',
            productType: 'debitCard',
            productVersion: '13.201.001-rls',
            Brand: {
                brandName: 'bankingapi',
                applicationUri: 'https://bankingapi.ru/products/debit-card/apply'
            },
            ProductDetails: {
                active: true,
                activeFrom: '2023-01-01T00:00:00+00:00',
                activeTo: '2025-12-31T23:59:59+00:00',
                feeFreeLength: 0,
                feeFreeLengthPeriod: 'None',
                productInsurance: false,
                DeliveryRegions: [
                    {
                        comments: [
                            'Доступна по всей территории Российской Федерации'
                        ]
                    }
                ],
                FeatureAndBenefit: [
                    {
                        FeatureAndBenefitGroup: [
                            {
                                name: 'Начисление процентов на остаток',
                                type: 'InterestOnBalance',
                                comments: [
                                    'Начисление 3% годовых на остаток средств'
                                ],
                                benefitGroupNominalValue: '3.00',
                                fee: '0.00',
                                applicationFrequency: 'Monthly'
                            }
                        ],
                        FeatureAndBenefitItem: [
                            {
                                identification: 'd3b7bcb1-ce8d-407d-b377-d7663c586f73',
                                type: 'InterestOnBalance',
                                name: 'Начисление процентов на остаток',
                                comments: [
                                    'Начисление 3% годовых на остаток средств'
                                ],
                                amount: '3.00',
                                indicator: true,
                                textual: 'Начисление 3% годовых на остаток средств'
                            }
                        ]
                    }
                ],
                Eligibility: [
                    {
                        name: 'Возраст от 18 лет',
                        description: 'Клиенты в возрасте от 18 до 65 лет',
                        type: 'NewCustomersOnly',
                        comments: [
                            'Требуется паспорт гражданина РФ'
                        ],
                        amount: '18',
                        indicator: true,
                        textual: 'Возраст от 18 до 65 лет',
                        period: 'Year'
                    }
                ]
            }
        };
        break;

        case '550e8400-e29b-41d4-a716-446655440002':
        product = {
            productId: '550e8400-e29b-41d4-a716-446655440002',
            productName: 'Ипотечный кредит "Жилищный комфорт"',
            productType: 'mortgage',
            productVersion: '13.201.001-rls',
            Brand: {
                brandName: 'bankingapi',
                applicationUri: 'https://bankingapi.ru/products/mortgage/apply'
            },
            ProductDetails: {
                active: true,
                activeFrom: '2023-01-01T00:00:00+00:00',
                activeTo: '2035-12-31T23:59:59+00:00',
                feeFreeLength: 0,
                feeFreeLengthPeriod: 'None',
                productInsurance: true,
                DeliveryRegions: [
                    {
                        comments: [
                            'Доступна по всей территории Российской Федерации'
                        ]
                    }
                ],
                FeatureAndBenefit: [
                    {
                        FeatureAndBenefitGroup: [
                            {
                                name: 'Низкая процентная ставка',
                                type: 'LowInterestRate',
                                comments: [
                                    'Процентная ставка от 7.5% годовых'
                                ],
                                benefitGroupNominalValue: '7.50',
                                fee: '0.00',
                                applicationFrequency: 'Monthly'
                            }
                        ],
                        FeatureAndBenefitItem: [
                            {
                                identification: 'a1b2c3d4-ce8d-407d-b377-d7663c586f73',
                                type: 'LowInterestRate',
                                name: 'Низкая процентная ставка',
                                comments: [
                                    'Процентная ставка от 7.5% годовых'
                                ],
                                amount: '7.50',
                                indicator: true,
                                textual: 'Процентная ставка от 7.5% годовых'
                            }
                        ]
                    }
                ],
                Eligibility: [
                    {
                        name: 'Возраст от 18 лет',
                        description: 'Клиенты в возрасте от 18 до 65 лет',
                        type: 'NewCustomersOnly',
                        comments: [
                            'Требуется паспорт гражданина РФ'
                        ],
                        amount: '18',
                        indicator: true,
                        textual: 'Возраст от 18 до 65 лет',
                        period: 'Year'
                    }
                ]
            }
        };
        break;

        case '550e8400-e29b-41d4-a716-446655440003':
        product = {
            productId: '550e8400-e29b-41d4-a716-446655440003',
            productName: 'Потребительский кредит "На любые цели"',
            productType: 'loanIndividual',
            productVersion: '13.201.001-rls',
            Brand: {
                brandName: 'bankingapi',
                applicationUri: 'https://bankingapi.ru/products/personal-loan/apply'
            },
            ProductDetails: {
                active: true,
                activeFrom: '2023-01-01T00:00:00+00:00',
                activeTo: '2030-12-31T23:59:59+00:00',
                feeFreeLength: 0,
                feeFreeLengthPeriod: 'None',
                productInsurance: false,
                DeliveryRegions: [
                    {
                        comments: [
                            'Доступна по всей территории Российской Федерации'
                        ]
                    }
                ],
                FeatureAndBenefit: [
                    {
                        FeatureAndBenefitGroup: [
                            {
                                name: 'Отсрочка платежа',
                                type: 'PaymentHoliday',
                                comments: [
                                    'Отсрочка до 3 месяцев на первый платеж'
                                ],
                                benefitGroupNominalValue: '3',
                                fee: '0.00',
                                applicationFrequency: 'OneTime'
                            }
                        ],
                        FeatureAndBenefitItem: [
                            {
                                identification: 'f4e5d6b7-ce8d-407d-b377-d7663c586f73',
                                type: 'PaymentHoliday',
                                name: 'Отсрочка платежа',
                                comments: [
                                    'Отсрочка до 3 месяцев на первый платеж'
                                ],
                                amount: '3',
                                indicator: true,
                                textual: 'Отсрочка до 3 месяцев на первый платеж'
                            }
                        ]
                    }
                ],
                Eligibility: [
                    {
                        name: 'Возраст от 18 лет',
                        description: 'Клиенты в возрасте от 18 до 65 лет',
                        type: 'NewCustomersOnly',
                        comments: [
                            'Требуется паспорт гражданина РФ'
                        ],
                        amount: '18',
                        indicator: true,
                        textual: 'Возраст от 18 до 65 лет',
                        period: 'Year'
                    }
                ]
            }
        };
        break;

        case '550e8400-e29b-41d4-a716-446655440004':
        product = {
            productId: '550e8400-e29b-41d4-a716-446655440004',
            productName: 'Вклад "Сберегательный"',
            productType: 'depositIndividual',
            productVersion: '13.201.001-rls',
            Brand: {
                brandName: 'bankingapi',
                applicationUri: 'https://bankingapi.ru/products/saving-deposit/apply'
            },
            ProductDetails: {
                active: true,
                activeFrom: '2023-01-01T00:00:00+00:00',
                activeTo: '2026-12-31T23:59:59+00:00',
                feeFreeLength: 0,
                feeFreeLengthPeriod: 'None',
                productInsurance: false,
                DeliveryRegions: [
                    {
                        comments: [
                            'Доступен по всей территории Российской Федерации'
                        ]
                    }
                ],
                FeatureAndBenefit: [
                    {
                        FeatureAndBenefitGroup: [
                            {
                                name: 'Начисление процентов на вклад',
                                type: 'InterestOnDeposit',
                                comments: [
                                    'Процентная ставка до 4.5% годовых'
                                ],
                                benefitGroupNominalValue: '4.50',
                                fee: '0.00',
                                applicationFrequency: 'Monthly'
                            }
                        ],
                        FeatureAndBenefitItem: [
                            {
                                identification: 'g7h8i9j0-ce8d-407d-b377-d7663c586f73',
                                type: 'InterestOnDeposit',
                                name: 'Начисление процентов на вклад',
                                comments: [
                                    'Процентная ставка до 4.5% годовых'
                                ],
                                amount: '4.50',
                                indicator: true,
                                textual: 'Процентная ставка до 4.5% годовых'
                            }
                        ]
                    }
                ],
                Eligibility: [
                    {
                        name: 'Возраст от 18 лет',
                        description: 'Клиенты в возрасте от 18 до 65 лет',
                        type: 'NewCustomersOnly',
                        comments: [
                            'Требуется паспорт гражданина РФ'
                        ],
                        amount: '18',
                        indicator: true,
                        textual: 'Возраст от 18 до 65 лет',
                        period: 'Year'
                    }
                ]
            }
        };
        break;


        case '550e8400-e29b-41d4-a716-446655440006':
        product = {
            productId: '550e8400-e29b-41d4-a716-446655440006',
            productName: 'Инвестиционный счёт "Инвестиции+"',
            productType: 'investment',
            productVersion: '13.201.001-rls',
            Brand: {
                brandName: 'bankingapi',
                applicationUri: 'https://bankingapi.ru/products/investment-account/apply'
            },
            ProductDetails: {
                active: true,
                activeFrom: '2023-06-01T00:00:00+00:00',
                activeTo: '2028-12-31T23:59:59+00:00',
                feeFreeLength: 0,
                feeFreeLengthPeriod: 'None',
                productInsurance: true,
                DeliveryRegions: [
                    {
                        comments: [
                            'Доступен по всей территории Российской Федерации'
                        ]
                    }
                ],
                FeatureAndBenefit: [
                    {
                        FeatureAndBenefitGroup: [
                            {
                                name: 'Налоговые льготы',
                                type: 'TaxBenefits',
                                comments: [
                                    'Возможность получения налогового вычета на взносы'
                                ],
                                benefitGroupNominalValue: '13.00',
                                fee: '0.00',
                                applicationFrequency: 'Yearly'
                            }
                        ],
                        FeatureAndBenefitItem: [
                            {
                                identification: 'i1j2k3l4-ce8d-407d-b377-d7663c586f73',
                                type: 'TaxBenefits',
                                name: 'Налоговые льготы',
                                comments: [
                                    'Возможность получения налогового вычета на взносы'
                                ],
                                amount: '13.00',
                                indicator: true,
                                textual: 'Налоговый вычет до 13% на взносы'
                            }
                        ]
                    }
                ],
                Eligibility: [
                    {
                        name: 'Возраст от 18 лет',
                        description: 'Клиенты в возрасте от 18 до 65 лет',
                        type: 'NewCustomersOnly',
                        comments: [
                            'Требуется паспорт гражданина РФ'
                        ],
                        amount: '18',
                        indicator: true,
                        textual: 'Возраст от 18 до 65 лет',
                        period: 'Year'
                    }
                ]
            }
        };
        break;

        case '550e8400-e29b-41d4-a716-446655440008':
        product = {
            productId: '550e8400-e29b-41d4-a716-446655440008',
            productName: 'Автокредит "Лёгкий старт"',
            productType: 'loanCar',
            productVersion: '13.201.001-rls',
            Brand: {
                brandName: 'bankingapi',
                applicationUri: 'https://bankingapi.ru/products/auto-loan/apply'
            },
            ProductDetails: {
                active: true,
                activeFrom: '2023-01-01T00:00:00+00:00',
                activeTo: '2030-12-31T23:59:59+00:00',
                feeFreeLength: 0,
                feeFreeLengthPeriod: 'None',
                productInsurance: true,
                DeliveryRegions: [
                    {
                        comments: [
                            'Доступен по всей территории Российской Федерации'
                        ]
                    }
                ],
                FeatureAndBenefit: [
                    {
                        FeatureAndBenefitGroup: [
                            {
                                name: 'Сниженная процентная ставка',
                                type: 'LowInterestRate',
                                comments: [
                                    'Процентная ставка от 9.5% годовых при первом взносе от 20%'
                                ],
                                benefitGroupNominalValue: '9.50',
                                fee: '0.00',
                                applicationFrequency: 'Monthly'
                            }
                        ],
                        FeatureAndBenefitItem: [
                            {
                                identification: 'm4n5o6p7-ce8d-407d-b377-d7663c586f73',
                                type: 'LowInterestRate',
                                name: 'Сниженная процентная ставка',
                                comments: [
                                    'Процентная ставка от 9.5% годовых при первом взносе от 20%'
                                ],
                                amount: '9.50',
                                indicator: true,
                                textual: 'Процентная ставка от 9.5% годовых'
                            }
                        ]
                    }
                ],
                Eligibility: [
                    {
                        name: 'Возраст от 18 лет',
                        description: 'Клиенты в возрасте от 18 до 65 лет',
                        type: 'NewCustomersOnly',
                        comments: [
                            'Требуется паспорт гражданина РФ'
                        ],
                        amount: '18',
                        indicator: true,
                        textual: 'Возраст от 18 до 65 лет',
                        period: 'Year'
                    }
                ]
            }
        };
        break;

        default:
            res.status(404).send('Product not found');
            return;
    }

    setResponseHeaders(res);
    res.setHeader('x-fapi-interaction-id', '4aca5b0d-1730-416f-a52b-6d353b687082');
    res.setHeader('Etag', '550e8400-e29b-41d4-a716-446655440000');
    res.setHeader('x-jws-signature', 'dummy-signature');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json({
        Data: {
            Product: product
        },
        Links: {
            self: 'https://sb.example.ru/v1.3/example?page=1',
            first: 'https://sb.example.ru/v1.3/example?page=1',
            prev: 'https://sb.example.ru/v1.3/example?page=1',
            next: 'https://sb.example.ru/v1.3/example?page=1',
            last: 'https://sb.example.ru/v1.3/example?page=1'
        },
        Meta: {
            totalPages: 1
        }
    });
});

// 3. Создание ресурса для генерации лида с динамическим выбором статуса
app.post('/customer-leads', (req, res) => {
    const statuses = ['AwaitingAuthorisation', 'Authorised', 'Rejected', 'Completed', 'Pending']; // возможные статусы
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    setResponseHeaders(res);
    res.status(201).json({
        Data: {
            customerLeadId: faker.string.uuid(),
            leadStatus: randomStatus,
            permissions: ['ReadProductOffer']
        },
        Links: {
            self: `https://example.com/customer-leads/${faker.string.uuid()}`,
            first: "https://example.com/customer-leads?page=1",
            last: "https://example.com/customer-leads?page=1"
        },
        Meta: {
            totalPages: 1
        }
    });
});


// 5. Удаление ресурса лида по его ID
app.delete('/customer-leads/:customerLeadId', (req, res) => {
    const { customerLeadId } = req.params;
    // if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(customerLeadId)) {
    //     setResponseHeaders(res);
    //     return res.status(400).json({ error: 'Invalid customerLeadId format' });
    // }

    setResponseHeaders(res);
    res.status(204).send();
});

// 6. Создание предложения по продукту для лида
app.post('/product-offers', (req, res) => {
    res.status(201).json({
        Data: {
            offerId: "OFFER-01-" + faker.string.uuid().slice(0, 13), // Укоротил UUID для соответствия ограничению в 40 символов
            offerStatus: "AwaitingAuthorisation",
            customerLeadId: faker.string.uuid().slice(0, 13), // Укоротил UUID для соответствия ограничению в 40 символов
            ProductOffers: [
                {
                    offerId: "OFFER-01-" + faker.string.uuid().slice(0, 13), // Укоротил UUID для соответствия ограничению в 40 символов
                    productId: faker.string.uuid().slice(0, 13), // Укоротил UUID для соответствия ограничению в 40 символов
                    accountId: faker.string.uuid().slice(0, 13), // Укоротил UUID для соответствия ограничению в 40 символов
                    offerType: "ProductApplication",
                    description: faker.lorem.sentence(),
                    startDateTime: new Date().toISOString(),
                    endDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Через неделю
                    rate: parseFloat(faker.finance.amount(0, 99, 4)).toFixed(4) + "%", // Значение не превышает 99 и округлено до 4 знаков после запятой
                    value: faker.number.int({ min: 1, max: 100 }),
                    term: "12 месяцев",
                    URL: faker.internet.url(),
                    Amount: {
                        amount: parseFloat(faker.finance.amount(100, 1000, 2)).toFixed(2), // Формат с двумя знаками после запятой
                        currency: "RUB"
                    },
                    Fee: {
                        amount: parseFloat(faker.finance.amount(100, 1000, 2)).toFixed(2), // Формат с двумя знаками после запятой
                        currency: "RUB"
                    }
                }
            ]
        },
        Links: {
            self: faker.internet.url(),
            first: faker.internet.url(),
            prev: faker.internet.url(),
            next: faker.internet.url(),
            last: faker.internet.url()
        },
        Meta: {
            totalPages: 4
        }
    });
});

// 7. Список всех предложений по продукту для лида
app.get('/product-offers', (req, res) => {
    const offers = Array.from({ length: 5 }, () => ({
        offerId: faker.string.uuid(),
        productId: faker.string.uuid(),
        status: 'доступно',
    }));
    res.json(offers);
});

// 8. Получение информации о предложении по продукту по его ID
app.get('/product-offers/:offerId', (req, res) => {
    const { offerId } = req.params;
    res.json({
        offerId,
        productId: faker.string.uuid(),
        status: 'принято',
        offerDetails: faker.lorem.sentence(),
    });
});

// 9. Удаление ресурса предложения по продукту по его ID
app.delete('/product-offers/:offerId', (req, res) => {
    const { offerId } = req.params;
    res.json({
        message: `Предложение по продукту ${offerId} успешно удалено`,
    });
});

// 10. Создание ресурса согласия на предложение по продукту
app.post('/product-offer-consents', (req, res) => {
    res.json({
        consentId: faker.string.uuid(),
        offerId: faker.string.uuid(),
        status: 'создано',
    });
});

// 11. Получение информации о согласии на предложение по продукту по его ID
app.get('/product-offer-consents/:consentId', (req, res) => {
    const { consentId } = req.params;
    res.json({
        consentId,
        offerId: faker.string.uuid(),
        status: 'одобрено',
    });
});

// 12. Удаление ресурса согласия по его ID
app.delete('/product-offer-consents/:consentId', (req, res) => {
    const { consentId } = req.params;
    res.json({
        message: `Согласие ${consentId} успешно удалено`,
    });
});

// 13. Создание заявки на продукт
app.post('/product-application', (req, res) => {
    res.json({
        productApplicationId: faker.string.uuid(),
        status: 'отправлено',
        submittedAt: new Date().toISOString(),
    });
});

// 14. Получение статуса всех заявок на продукты
app.get('/product-application', (req, res) => {
    const applications = Array.from({ length: 5 }, () => ({
        productApplicationId: faker.string.uuid(),
        status: 'в процессе',
        createdAt: new Date().toISOString(),
    }));
    res.json(applications);
});

// 15. Получение информации о заявке на продукт по ее ID
app.get('/product-application/:productApplicationId', (req, res) => {
    const { productApplicationId } = req.params;
    res.json({
        productApplicationId,
        status: 'одобрено',
        applicationDetails: faker.lorem.sentence(),
    });
});

// 16. Удаление заявки на продукт по ее ID
app.delete('/product-application/:productApplicationId', (req, res) => {
    const { productApplicationId } = req.params;
    res.json({
        message: `Заявка на продукт ${productApplicationId} успешно удалена`,
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
