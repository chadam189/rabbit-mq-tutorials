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

    const queue = 'hello';
    const msg = 'Hello World!';

    channel.assertQueue(queue, {
      durable: false
    });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(` [x] sent ${msg}`);
  });

  setTimeout(function() {
    connection.close();
    console.log('closed connection');
    process.exit(0);
  }, 500);
});

