#!/usr/bin/env node

var Queue = 'exec_expressjs';
var address = process.env.REDIS_HOST || 'localhost:6379';
var serverUrl = process.env.SERVER_URL || null;

console.log("Connecting to Redis", address);

var fork = require('child_process').fork;
var redis = require('redis');
var _ = require('lodash');
var redisAddress = address.split(':');

var client = redis.createClient(parseInt(redisAddress[1], 10), redisAddress[0]);
var client2 = redis.createClient(parseInt(redisAddress[1], 10), redisAddress[0]);

client.on('error', function(err) {
  throw err;
});

var workers = {};

client.on('message', function(channel, msgString) {
  var msg2 = JSON.parse(msgString);
  var msg = msg2.content;
  var port = 9000 + Math.floor(Math.random() * 5000);

  if (workers[msg.client]) {
    var workerData = workers[msg.client];
    port = workerData.port;
    clearTimeout(workerData.timeout);
    workerData.worker.kill('SIGKILL');
  }

  console.log("  Forking new worker");
  var worker = fork('../proc_runner', [], {
    silent: false
  });

  workers[msg.client] = {
    port: port,
    worker: worker,
    timeout: setTimeout(function() {
      delete workers[msg.client];
      worker.kill('SIGKILL');
    }, 900000)
  };

  var reply = function(thing) {
    thing.port = port;
    thing.url = serverUrl;
    thing.timestamp = msg.timestamp;

    console.log("Replying with correlationId", msg2.properties.correlationId);

    isPortTaken(port, function(err, isTaken) {
      thing.isDead = !isTaken;

      client2.publish(msg2.properties.replyTo, JSON.stringify({
        content: thing,
        properties: {
          correlationId: msg2.properties.correlationId
        }
      }));

    });
  };

  var replyLater = _.throttle(reply, 150, {
    trailing: true,
    leading: false
  });

  worker.on("message", function(rep) {
    // prepare reply
    replyLater(rep);
  });


  worker.send({
    msg: msg,
    env: {
      PORT: port
    }
  }); //Send the code to run for the worker

});

client.subscribe(Queue);


function isPortTaken(port, fn) {
  var net = require('net');

  var tester = net.createServer().once('error', function(err) {
    if (err.code != 'EADDRINUSE') {
      return fn(err);
    }

    fn(null, true);
  }).once('listening', function() {
    tester.once('close', function() {
      fn(null, false);
    }).close();
  }).listen(port);
}
