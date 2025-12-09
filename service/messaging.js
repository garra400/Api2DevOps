const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://devops:devops@localhost:5672';
const ALERT_QUEUE = 'alerts_queue';

let connection;
let channel;

async function connect() {
  if (channel) return channel;

  connection = await amqp.connect(RABBIT_URL);
  channel = await connection.createChannel();
  await channel.assertQueue(ALERT_QUEUE, { durable: true });

  console.log('[RabbitMQ] Conectado e fila assertada:', ALERT_QUEUE);
  return channel;
}

async function sendAlertMessage(message) {
  const ch = await connect();
  const payload = Buffer.from(JSON.stringify(message));

  ch.sendToQueue(ALERT_QUEUE, payload, { persistent: true });
  console.log('[RabbitMQ] Mensagem enviada para fila', ALERT_QUEUE, message);
}

module.exports = {
  sendAlertMessage,
};
