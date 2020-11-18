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

    // this creates the queue! 
    // it's idempotent, so it does nothing if the queue already exists
    channel.assertQueue(queue, {
      durable: true,
    });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    const messageHandler = (msg) => {
      const delayDuration = msg.content.toString().split('.').length - 1;
      console.log(` [x] Received ${msg.content.toString()}`);

      setTimeout(() => {
        console.log(' [x] Done');
      }, delayDuration * 1000);
    };

    const consumerOptions = {
      noAck: false,
    };

    channel.consume(queue, messageHandler, consumerOptions);
  });
});

