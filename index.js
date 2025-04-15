const express = require("express");
const axios = require("axios");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.BREVO_API_KEY;
const BREVO_API = process.env.BREVO_API || "https://api.brevo.com/v3/";

app.all("/proxy-brevo/*", async (req, res) => {
  try {
    const targetPath = req.path.replace("/proxy-brevo", "");
    const response = await axios({
      method: req.method,
      url: `${BREVO_API}${targetPath}`,
      headers: {
        "api-key": API_KEY,
        "Content-Type": req.headers["content-type"] || "application/json"
      },
      data: req.body
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Error proxy:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Brevo Proxy corriendo en puerto ${PORT}`));
