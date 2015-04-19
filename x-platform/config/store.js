var redis = require('redis');
var redisStore = require('connect-redis');
var url = require('url');

var config = require('./config');
var logger = require('./logging');



var address = (function(redisUrl) {
  'use strict';
  var parse = url.parse(redisUrl);
  return {
    host: parse.host,
    port: parse.port
  };
}(config.store));

logger.info('Connecting to Redis', config.store);
var client = redis.createClient(address.host, address.port);
var client2 = redis.createClient(address.host, address.port);

client.on('error', function(err) {
  'use strict';

  logger.error('Redis failure', err);
  throw err;
});

var subscribtions = {};
client2.on('message', function(channel, msg) {
  'use strict';

  if (!subscribtions[channel]) {
    return;
  }

  subscribtions[channel].forEach(function(cb) {
    cb(msg);
  });
});

module.exports = {

  subscribe: function(channelName, callback) {
    'use strict';
    subscribtions[channelName] = subscribtions[channelName] || [];
    subscribtions[channelName].push(callback);
    client2.subscribe(channelName);
  },

  publish: function(channelName, message) {
    'use strict';

    client.publish(channelName, message);
  },

  sessionStore: function(session) {
    'use strict';

    var RedisStore = redisStore(session);
    return new RedisStore({
      client: client
    });
  }

};
