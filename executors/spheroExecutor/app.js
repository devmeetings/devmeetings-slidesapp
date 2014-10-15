#!/usr/local/bin/node

var Queue = 'exec_sphero' + (process.env.SHPERO_NUMBER || "");

console.log("Connecting to RabbitMQ");


var amqp = require('amqplib');
var host = process.env.RABBITMQ_HOST || "localhost";

var connection = amqp.connect('amqp://' + host);

var sphero = require('./sphero');

connection.then(function(conn) {
    conn.createChannel().then(function(ch) {
        var ok = ch.assertQueue(Queue, {
            durable: false,
            exclusive: false
        }).then(function(qok) {
            // Read queue
            console.log("[*] Waiting for messages on " + Queue);
            sphero.connect();
            console.log("[*] Connecting to Sphero.");

            ch.consume(qok.queue, function(msg) {
                var acked = false;
                var reply = function(thing) {
                    if (!acked) {
                        ch.ack(msg);
                        acked = true;
                    }

                    ch.sendToQueue(msg.properties.replyTo, new Buffer(JSON.stringify(thing)), {
                        correlationId: msg.properties.correlationId
                    });
                };
                var toRun = msg.content.toString();

                // Run by sphero
                sphero.run(toRun, reply);
            });
        });
    });
}, function(err) {
    console.error(err);
});