const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;
const apiKey = process.env.BREVO_API_KEY;

if (!apiKey) {
  console.error("API Key no está configurada");
  process.exit(1);
}

app.use(cors()); // Habilitar CORS

app.get('/brevo', async (req, res) => {
  try {
    const response = await axios.get('https://api.brevo.com/v3/', {
      headers: {
        'api-key': apiKey
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al conectar con la API de Brevo');
  }
});

// NUEVO ENDPOINT para Grafana
app.get('/brevo/smtp/statistics/aggregatedReport', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const response = await axios.get('https://api.brevo.com/v3/smtp/statistics/aggregatedReport', {
      headers: {
        'api-key': apiKey
      },
      params: {
        startDate,
        endDate
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Error al obtener datos agregados de Brevo');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`By Maylon Escaño`);
});
