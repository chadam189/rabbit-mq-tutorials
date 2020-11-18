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

    console.log('asserting exchange');

    const exchange = 'logs';
    const msg = process.argv.slice(2).join(' ') || 'Hello World!';

    channel.assertExchange(exchange, 'fanout', {
      durable: true
    });

    channel.publish(exchange, '', Buffer.from(msg));
    console.log(` [x] Sent ${msg}`);
  });

  setTimeout(function() {
    connection.close();
    console.log('closed connection');
    process.exit(0);
  }, 500);
});

