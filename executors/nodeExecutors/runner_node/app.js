#!/usr/bin/env node

var Queue = 'exec_nodejs';

console.log("Connecting to Redis");

var cluster = require('cluster');
var redis = require('redis');
var redisAddress = require('url').parse(process.env.REDIS_HOST || 'localhost:6379');

var client = redis.createClient(redisAddress.host, redisAddress.port);
var client2 = redis.createClient(redisAddress.host, redisAddress.port);

cluster.setupMaster({
  exec: "../proc_runner.js",
  silent: false
});

cluster.on('exit', function(worker, code, signal) {
  console.log('  worker %d died (%s)',
    worker.process.pid, signal || code);
});

client.on('message', function(channel, msgString) {
  var msg = JSON.parse(msgString);
  var msgContent = msg.content;
  console.log("  Forking new worker");
  var worker = cluster.fork();
  var timer = 0;

  var reply = function(thing) {
    thing.timestamp = msgContent.timestamp;

    client2.publish(msg.properties.replyTo, JSON.stringify({
      content: thing,
      properties: {
        correlationId: msg.properties.correlationId
      }
    }));
  };
  worker.on("message", function(rep) {
    clearTimeout(timer); //The worker responded in under 5 seconds, clear the timeout
    // prepare reply
    reply(rep);
  });
  worker.on("exit", function() {
    clearTimeout(timer); //The worker responded in under 5 seconds, clear the timeout
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
    msg: msgContent,
    env: {}
  }); //Send the code to run for the worker
});

console.log("[*] Waiting for messages.");
client.subscribe(Queue);
