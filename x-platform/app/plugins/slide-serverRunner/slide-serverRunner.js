var uuid = require('node-uuid');
var when = require('when');
var defer = when.defer;
var _ = require('lodash');

var Workers = null;

exports.init = function(config) {

    var l = function( /* args */ ) {
        var args = [].slice.call(arguments);
        args.unshift("  [RabbitMQ]");
        console.log.apply(console, args);
    };

    Workers = (function(host) {

        l('Connecting to ' + host);

        var ReplyQueue = 'Replies_' + uuid();
        var amqp = require('amqplib');
        var connection = amqp.connect('amqp://' + host);
        var answers = {};

        connection.then(function() {
            l("Connection established");
        }, function() {
            throw new Error('Cannot connect to RabbitMQ at ' + host);
        });

        return {
            send: function(Queue, msg, callback) {
                l("Sending message to " + Queue);
                return connection.then(function(conn) {

                    return conn.createChannel().then(function(ch) {
                        var corrId = uuid();

                        answers[corrId] = {
                            callback: callback
                        };

                        var closeChannelLater = _.debounce(function(id){
                            delete answers[id];
                            ch.close();
                        }, 900000);

                        var maybeAnswer = function(msg) {
                            var id = msg.properties.correlationId;
                            if (answers[id]) {
                                ch.ack(msg);
                                var response = JSON.parse(msg.content.toString());
                                answers[id].callback(response);
                                closeChannelLater(id);
                                //delete answers[id];
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
                            l("Sending...");
                            ch.sendToQueue(Queue, new Buffer(JSON.stringify(msg)), {
                                correlationId: corrId,
                                replyTo: queue
                            });
                        });

                        return ok;

                    }, function(err){
                        console.error(err);
                    });
                });
            }
        };

    }(config.queue));
};

exports.onSocket = function(log, socket, io) {

    socket.on('serverRunner.code.run', function(data) {

        console.log(data);
        Workers.send('exec_' + data.runner, data, function(response) {
            socket.emit('serverRunner.code.result', response);
        });

    });
};