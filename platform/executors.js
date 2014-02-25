var uuid = require('node-uuid');
var when = require('when');
var defer = when.defer;


var ReplyQueue = 'run_replies';

console.log("Connecting to RabbitMQ");
var amqp = require('amqplib');


var connection = amqp.connect('amqp://localhost');

var answers = {};

module.exports = {
    send: function(Queue, msg, callback) {
        return connection.then(function(conn) {
            return conn.createChannel().then(function(ch) {
                var answer = defer();
                var corrId = uuid();

                answers[corrId] = answer;

                var maybeAnswer = function(msg) {
                    var id = msg.properties.correlationId;
                    if (answers[id]) {
                        answers[id].resolve(msg.content.toString());
                        delete answers[id];
                    }
                };

                var ok = ch.assertQueue(ReplyQueue, {
                    durable: false,
                    exclusive: false
                }).then(function(qok) {
                    return qok.queue;
                });

                ok = ok.then(function(queue) {
                    return ch.consume(queue, maybeAnswer).then(function() {
                        return queue;
                    });
                });

                ok = ok.then(function(queue) {
                    ch.sendToQueue(Queue, new Buffer(JSON.stringify(msg)), {
                        correlationId: corrId,
                        replyTo: queue
                    });
                    return answer.promise;
                });

                return ok.then(function(res) {
                    ch.close();
                    callback(res)
                });
            });
        });
    }
};