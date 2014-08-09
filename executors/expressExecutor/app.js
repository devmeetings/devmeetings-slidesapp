#!/usr/local/bin/node

var Queue = 'exec_expressjs';

console.log("Connecting to RabbitMQ");


var cluster = require('cluster');
var amqp = require('amqplib');
var host = process.env.RABBITMQ_HOST || "localhost";

var connection = amqp.connect('amqp://' + host);

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
                var port = 9000 + Math.floor(Math.random() * 5000);

                if (workers[msg.client]) {
                    port = workers[msg.client].port;
                    clearTimeout(workers[msg.client].timeout);
                    workers[msg.client].worker.destroy();
                }

                console.log("  Forking new worker", msg);
                var worker = cluster.fork();
                workers[msg.client] = {
                    port: port,
                    worker: worker,
                    timeout: setTimeout(function(){
                        delete workers[msg.client];
                        worker.destroy();
                    }, 900000)
                };

                var acked = false;
                var reply = function(thing) {
                    if (!acked) {
                        ch.ack(msg2);
                        acked = true;
                    }
                    thing.port = port;
                    
                    console.log("Replying", thing, msg2.properties.correlationId);
                    ch.sendToQueue(msg2.properties.replyTo, 
                        new Buffer(JSON.stringify(thing)), {
                        correlationId: msg2.properties.correlationId
                    });
                };
                worker.on("exit", function() {
                    if (acked) {
                        return;
                    }
                    reply({
                        success: false,
                        errors: ['Worker is dead'],
                        args: arguments
                    });
                });
                worker.on("message", function(rep) {
                    // prepare reply
                    reply(rep);
                });
                worker.send({
                    msg: msg,
                    port: port
                }); //Send the code to run for the worker
            });
        });
    });
});