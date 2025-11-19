const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const ALERT_QUEUE = 'alertas';

async function sendAlertMessage(alert) {
  const conn = await amqp.connect(RABBITMQ_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(ALERT_QUEUE, { durable: false });
  channel.sendToQueue(ALERT_QUEUE, Buffer.from(JSON.stringify(alert)));
  await channel.close();
  await conn.close();
}

module.exports = { sendAlertMessage };
