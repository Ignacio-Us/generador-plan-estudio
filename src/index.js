require('dotenv').config();
const express = require('express');
const cors = require('cors');

const planRoutes = require('./routes/plan.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.get('/health', (req, res) => {
    const apiKeyConfigured = !!process.env.LLM_API_KEY;

    res.status(200).json({
        status: 'up',
        environment: process.env.NODE_ENV || 'development',
        message: 'API esta funcionando correctamente',
        llm_connection: apiKeyConfigured ? 'API key configurada correctamente' : 'No se ha encontrado la API key',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/v1', planRoutes);

app.listen(PORT, () => {
    console.log(`API esta funcionando correctamente en el puerto ${PORT}`);
});