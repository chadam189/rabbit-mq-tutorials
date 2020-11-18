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

    // this creates the queue! 
    // it's idempotent, so it does nothing if the queue already exists
    channel.assertQueue(queue, {
      durable: false,
    });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    const messageHandler = (msg) => console.log(` [x] Received ${msg.content.toString()}`);

    const consumeOptions = {
      noAck: true,
    };

    channel.consume(queue, messageHandler, consumeOptions);
  });
});

