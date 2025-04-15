const express = require('express');
const axios = require('axios');
const client = require('prom-client'); // npm install prom-client
const app = express();

const port = process.env.PORT || 3000;
const apiKey = process.env.BREVO_API_KEY;

if (!apiKey) {
  console.error("API Key no está configurada");
  process.exit(1);
}

// Define las métricas
const deliveredGauge = new client.Gauge({ name: 'brevo_delivered', help: 'Emails entregados' });
const opensGauge = new client.Gauge({ name: 'brevo_opens', help: 'Emails abiertos' });
const clicksGauge = new client.Gauge({ name: 'brevo_clicks', help: 'Clicks totales' });
const hardBouncesGauge = new client.Gauge({ name: 'brevo_hard_bounces', help: 'Rebotes duros' });
const softBouncesGauge = new client.Gauge({ name: 'brevo_soft_bounces', help: 'Rebotes suaves' });
const blockedGauge = new client.Gauge({ name: 'brevo_blocked', help: 'Bloqueados' });
const requestsGauge = new client.Gauge({ name: 'brevo_requests', help: 'Solicitudes de envío' });

app.get('/metrics', async (req, res) => {
  try {
    const startDate = req.query.startDate || '2025-01-01';
    const endDate = req.query.endDate || new Date().toISOString().split('T')[0];

    const response = await axios.get(`https://api.brevo.com/v3/smtp/statistics/aggregatedReport?startDate=${startDate}&endDate=${endDate}`, {
      headers: { 'api-key': apiKey }
    });

    const data = response.data;

    deliveredGauge.set(data.delivered);
    opensGauge.set(data.opens);
    clicksGauge.set(data.clicks);
    hardBouncesGauge.set(data.hardBounces);
    softBouncesGauge.set(data.softBounces);
    blockedGauge.set(data.blocked);
    requestsGauge.set(data.requests);

    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error generando métricas');
  }
});
