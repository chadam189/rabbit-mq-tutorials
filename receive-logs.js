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

    const exchangeName = 'logs';

    // this creates the exchange! 
    // it's idempotent, so it does nothing if the queue already exists
    channel.assertExchange(exchangeName, 'fanout', {
      durable: true,
    });

    channel.assertQueue('', { exclusive: true }, function (error2, q) {
      if (error2) {
        throw error2;
      }

      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
      channel.bindQueue(q.queue, exchangeName, '');

      const messageHandler = (msg) => {
        if (msg.content) {
          console.log(" [x] %s", msg.content.toString());
        }
      };

      const consumerOptions = {
        noAck: false,
      };

      channel.consume(q.queue, messageHandler, consumerOptions);

    });
  });
});

