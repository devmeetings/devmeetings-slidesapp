#!/usr/local/bin/node

var Queue = 'run_express';
var ReplyQueue = 'run_replies';

console.log("Connecting to RabbitMQ");


var cluster = require('cluster');
var amqp = require('amqplib');

var connection = amqp.connect('amqp://localhost');

cluster.setupMaster({
    exec: "runner.js",
    silent: false
});
cluster.on('exit', function(worker, code, signal) {
    console.log('  worker %d died (%s)',
        worker.process.pid, signal || code);
});


var workers = {};

connection.then(function(conn) {
    conn.createChannel().then(function(ch) {
        var ok = ch.assertQueue(Queue, {
            durable: false,
            exclusive: false
        }).then(function(qok) {
            // Read queue
            console.log("[*] Waiting for messages.");
            ch.consume(qok.queue, function(msg2) {
                var msg = JSON.parse(msg2.content);

                if (workers[msg.client]) {
                    workers[msg.client].destroy();
                }

                console.log("  Forking new worker", msg);
                var worker = cluster.fork();
                workers[msg.client] = worker;

                var replied = false;
                var reply = function(thing) {
                    if (replied) {
                        return;
                    }
                    replied = true;
                    console.log("Replying", thing, msg2.properties.correlationId);
                    ch.ack(msg2);
                    ch.sendToQueue(ReplyQueue, new Buffer(JSON.stringify(thing)), {
                        correlationId: msg2.properties.correlationId
                    });
                };
                worker.on("exit", function() {
                    console.log("death");
                    reply({
                        errors: ['Worker is dead']
                    });
                });
                worker.on("message", function(rep) {
                    // prepare reply
                    reply(rep);
                });
                worker.send(msg2.content.toString()); //Send the code to run for the worker
            });
        });
    });
});