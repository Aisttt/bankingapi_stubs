const express = require('express');
const app = express();
const PORT = process.env.PORT || 3006; // Используйте другой порт для новой заглушки
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Заглушка для закрытия карты
app.post('/close/:publicId', (req, res) => {
    const { publicId } = req.params;
    const { 'X-Mdm-Id': mdmId, 'x-client-channel': clientChannel, 'X-PARTNER-ID': partnerId } = req.headers;

    res.status(202).header({
        'X-RateLimit-Limit': 1000,
        'X-RateLimit-Remaining': 999,
        'X-RateLimit-Reset': Date.now() + 60000
    }).json({
        message: "Запрос на закрытие карты принят",
        publicId
    });
});

// Заглушка для смены PIN-кода
app.post('/pin/:publicId', (req, res) => {
    const { publicId } = req.params;
    const { Pin, publicKeyId } = req.body;

    if (!publicId || !Pin || !publicKeyId) {
        return res.status(400).json({
            error: "Поля publicId, Pin и publicKeyId обязательны"
        });
    }

    res.status(200).header({
        'X-RateLimit-Limit': 1000,
        'X-RateLimit-Remaining': 998,
        'X-RateLimit-Reset': Date.now() + 60000
    }).json({
        message: "PIN-код успешно изменен",
        publicId
    });
});

// Заглушка для изменения статуса карты
app.put('/status/:publicId', (req, res) => {
    const { publicId } = req.params;
    const { newStatus, reason } = req.body;

    if (!publicId || !newStatus) {
        return res.status(400).json({
            error: "Поля publicId и newStatus обязательны"
        });
    }

    res.status(200).header({
        'X-RateLimit-Limit': 1000,
        'X-RateLimit-Remaining': 997,
        'X-RateLimit-Reset': Date.now() + 60000
    }).json({
        message: "Статус карты успешно изменен",
        publicId,
        newStatus,
        reason: reason || "Причина не указана"
    });
});

// Обработка всех неизвестных маршрутов
app.use((req, res) => {
    res.status(404).json({ message: "Маршрут не найден" });
});

app.listen(port, () => {
    console.log(`Mock API сервер запущен на порту ${port}`);
});
