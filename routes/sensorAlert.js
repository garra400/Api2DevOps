const express = require('express');
const router = express.Router();
const { processSensorData } = require('../service/alertLogic');

// Endpoint para receber dados do IoT
router.post('/sensor-data', async (req, res) => {
  try {
    await processSensorData(req.body);
    res.status(200).json({ message: 'Dados processados com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar dados.' });
  }
});

module.exports = router;
