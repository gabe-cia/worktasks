(function () {
    'use strict';

    let send = async (queue, message) => {
        _connect()
            .then(channel => _createQueue(channel, queue))
            .then(channel => channel.sendToQueue(queue, Buffer.from(JSON.stringify(message))))
            .catch(err => console.log(err))
    };

    let consume = async (queue, callback) => {
        _connect()
            .then(channel => _createQueue(channel, queue))
            .then(channel => channel.consume(queue, callback, { noAck: true }))
            .catch(err => console.log(err));
    };

    function _connect() {
        return require('amqplib').connect(process.env.MQ_URL)
            .then(conn => conn.createChannel());
    }

    function _createQueue(channel, queue) {
        return new Promise((resolve, reject) => {
            try {
                channel.assertQueue(queue, { durable: true });
                resolve(channel);
            }
            catch (err) {
                reject(err);
            }
        });
    }

    module.exports = {
        send,
        consume
    };
})();