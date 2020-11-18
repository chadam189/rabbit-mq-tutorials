const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error0;
  }

  console.log('opening connection');

  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    const queue = 'task_queue';
    const msg = process.argv.slice(2).join(' ') || 'Hello World!';

    channel.assertQueue(queue, {
      durable: true
    });

    channel.prefetch(1);

    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
    console.log(` [x] Sent ${msg}`);
  });

  setTimeout(function() {
    connection.close();
    console.log('closed connection');
    process.exit(0);
  }, 500);
});

