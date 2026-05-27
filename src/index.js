require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'up',
        environment: process.env.NODE_ENV || 'development',
        message: 'API esta funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`API esta funcionando correctamente en el puerto ${PORT}`);
});