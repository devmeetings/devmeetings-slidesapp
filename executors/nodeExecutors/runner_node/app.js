#!/usr/bin/env node

var Queue = 'exec_nodejs';

console.log("Connecting to RabbitMQ");


var cluster = require('cluster');
var amqp = require('amqplib');
var host = process.env.RABBITMQ_HOST || "localhost";

var connection = amqp.connect('amqp://' + host);

cluster.setupMaster({
    exec: "../proc_runner.js",
    silent: false
});

cluster.on('exit', function(worker, code, signal) {
    console.log('  worker %d died (%s)',
        worker.process.pid, signal || code);
});

connection.then(function(conn) {
    conn.createChannel().then(function(ch) {
        var ok = ch.assertQueue(Queue, {
            durable: false,
            exclusive: false
        }).then(function(qok) {
            // Read queue
            console.log("[*] Waiting for messages.");
            ch.consume(qok.queue, function(msg) {
                console.log("  Forking new worker");
                var worker = cluster.fork();
                var timer = 0;

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
                worker.on("message", function(rep) {
                    clearTimeout(timer); //The worker responded in under 5 seconds, clear the timeout
                    // prepare reply
                    reply(rep);
                });
                worker.on("exit", function() {
                    clearTimeout(timer); //The worker responded in under 5 seconds, clear the timeout
                    if (acked) {
                        return;
                    }
                    ch.ack(msg);
                    acked = true;
                    reply({
                        success: true,
                        result: []
                    });
                });
                timer = setTimeout(function() {
                    reply({
                        success: false,
                        errors: ["Worker timed out."]
                    });
                    console.log("  worker timed out");
                    worker.destroy(); //Give it 5 seconds to run, then abort it
                }, 5000);
                worker.send({
                  msg: JSON.parse(msg.content),
                  env: {}
                }); //Send the code to run for the worker
            });
        });
    });
}, function(err) {
    console.error(err);
});