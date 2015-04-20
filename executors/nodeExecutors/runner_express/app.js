#!/usr/bin/env node

var Queue = 'exec_expressjs';
var address = process.env.REDIS_HOST || 'localhost:6379';

console.log("Connecting to Redis", address);

var cluster = require('cluster');
var redis = require('redis');
var redisAddress = address.split(':');

var client = redis.createClient(parseInt(redisAddress[1], 10), redisAddress[0]);
var client2 = redis.createClient(parseInt(redisAddress[1], 10), redisAddress[0]);

client.on('error', function(err) {
  throw err;
});

cluster.setupMaster({
  exec: '../proc_runner.js',
  silent: false
});

cluster.on('exit', function(worker, code, signal) {
  console.log('  worker %d died (%s)',
    worker.process.pid, signal || code);
});

var workers = {};

client.on('message', function(channel, msgString) {
  var msg2 = JSON.parse(msgString);
  var msg = msg2.content;
  var port = 9000 + Math.floor(Math.random() * 5000);

  if (workers[msg.client]) {
    port = workers[msg.client].port;
    clearTimeout(workers[msg.client].timeout);
    workers[msg.client].worker.destroy();
  }

  console.log("  Forking new worker");
  var worker = cluster.fork();
  workers[msg.client] = {
    port: port,
    worker: worker,
    timeout: setTimeout(function() {
      delete workers[msg.client];
      worker.destroy();
    }, 900000)
  };

  var reply = function(thing) {
    thing.port = port;
    thing.timestamp = msg.timestamp;

    console.log("Replying with correlationId", msg2.properties.correlationId);

    client2.publish(msg2.properties.replyTo, JSON.stringify({
      content: thing,
      properties: {
        correlationId: msg2.properties.correlationId
      }
    }));
  };

  worker.on("message", function(rep) {
    // prepare reply
    reply(rep);
  });

  worker.send({
    msg: msg,
    env: {
      PORT: port
    }
  }); //Send the code to run for the worker
});

client.subscribe(Queue);
