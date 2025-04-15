const express = require('express');
const axios = require('axios');
const app = express();

const port = process.env.PORT || 3000;
const apiKey = process.env.BREVO_API_KEY;

if (!apiKey) {
  console.error("API Key no está configurada");
  process.exit(1);
}

// Ruta de prueba
app.get('/brevo', async (req, res) => {
  try {
    const response = await axios.get('https://api.brevo.com/v3/', {
      headers: { 'api-key': apiKey }
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al conectar con la API de Brevo');
  }
});

// Ruta que usará Grafana
app.get('/brevo/smtp/statistics/aggregatedReport', async (req, res) => {
  try {
    // Puedes recibir fechas por query param (o usar valores por defecto)
    const startDate = req.query.startDate || '2025-01-01';
    const endDate = req.query.endDate || new Date().toISOString().split('T')[0];

    const response = await axios.get(`https://api.brevo.com/v3/smtp/statistics/aggregatedReport?startDate=${startDate}&endDate=${endDate}`, {
      headers: { 'api-key': apiKey }
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(error.response?.status || 500).send(error.response?.data || 'Error al obtener datos');
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`By Maylon Escaño`);
});
