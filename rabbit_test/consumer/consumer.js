require('dotenv').config();
const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE_NAME = process.env.RABBITMQ_QUEUE || 'alerts_queue';

async function startConsumer() {
  try {
    console.log('[*] Conectando ao RabbitMQ em', RABBITMQ_URL);
    const connection = await amqp.connect(RABBITMQ_URL);

    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, {
      durable: true, // fila persiste se o RabbitMQ reiniciar
    });

    // Opcional: limitar quantas mensagens esse consumidor processa ao mesmo tempo
    channel.prefetch(1);

    console.log(`[*] Aguardando mensagens na fila "${QUEUE_NAME}". Pressione CTRL+C para sair.`);

    channel.consume(
      QUEUE_NAME,
      (msg) => {
        if (msg !== null) {
          const content = msg.content.toString();

          console.log('---------------------------------');
          console.log('[x] Mensagem recebida:');
          console.log('Raw:', content);

          // Se você estiver mandando JSON do produtor:
          try {
            const data = JSON.parse(content);
            console.log('JSON parseado:', data);

            // Aqui entra a lógica de negócio:
            // ex: enviar email, chamar outra API, salvar no banco, etc.
            if (data.type === 'ALERT') {
              console.log(`>> ALERTA: temperatura = ${data.temperature}, umidade = ${data.humidity}`);
            }
          } catch (e) {
            console.log('Não é JSON ou falha ao parsear:', e.message);
          }

          // Confirma processamento para remover da fila
          channel.ack(msg);
        }
      },
      {
        noAck: false, // só remove da fila depois do ack
      }
    );

    // Tratamento básico se a conexão cair
    connection.on('close', () => {
      console.error('[!] Conexão com RabbitMQ fechada');
      process.exit(1);
    });

    connection.on('error', (err) => {
      console.error('[!] Erro na conexão RabbitMQ:', err.message);
    });
  } catch (error) {
    console.error('[!] Erro ao iniciar consumidor:', error);
    process.exit(1);
  }
}

startConsumer();
