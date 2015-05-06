var store = require('../../config/store');
var Q = require('q');

var client = store.client;
var client2 = store.client2;

var subscribtions = {};
var msgCount = 0;
client2.on('message', function(channel, msg) {
  'use strict';

  if (!subscribtions[channel]) {
    return;
  }

  subscribtions[channel].forEach(function(cb) {
    cb(msg);
  });
});

module.exports = (function() {
  'use strict';

  return {

    get: function(key) {
      return Q.ninvoke(client, 'get', key);
    },

    set: function(key, value) {
      return Q.ninvoke(client, 'set', key, value);
    },

    del: function(key) {
      return Q.ninvoke(client, 'del', key);
    },

    sadd: function(key, value) {
      return Q.ninvoke(client, 'sadd', key, value);
    },

    smembers: function(key) {
      return Q.ninvoke(client, 'smembers', key);
    },

    hset: function(key, field, value) {
      return Q.ninvoke(client, 'hset', key, field, value);
    },

    hdel: function(key, field) {
      return Q.ninvoke(client, 'hdel', key, field);
    },

    hgetall: function(key) {
      return Q.ninvoke(client, 'hgetall', key);
    },

    hincrby: function(key, field, value) {
      return Q.ninvoke(client, 'hincrby', key, field, value);
    },

    subscribe: function(channelName, callback) {
      subscribtions[channelName] = subscribtions[channelName] || [];
      subscribtions[channelName].push(callback);
      client2.subscribe(channelName);
    },

    publish: function(channelName, message) {

      client.publish(channelName, message);
    },
  };

}());
