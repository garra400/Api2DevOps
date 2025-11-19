const { sendAlertMessage } = require('../service/messaging');

// Exemplo de uso: chamar esta função quando receber dados do IoT
async function processSensorData(sensorData) {
  const { temperatura, umidade } = sensorData;
  if (temperatura > 40 || umidade < 20) {
    await sendAlertMessage({
      tipo: 'ALERTA_ESTUFA',
      mensagem: `Temperatura: ${temperatura}, Umidade: ${umidade}`,
      data: new Date().toISOString(),
    });
  }
}

module.exports = { processSensorData };
