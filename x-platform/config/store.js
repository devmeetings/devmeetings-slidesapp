var redis = require('redis');
var redisStore = require('connect-redis');

var config = require('./config');
var logger = require('./logging');



var address = (function(redisUrl) {
  'use strict';
  var parse = redisUrl.split(':');
  return {
    host: parse[0],
    port: parseInt(parse[1], 10)
  };
}(config.store));

logger.info('Connecting to Redis', config.store);
var client = redis.createClient(address.port, address.host);
var client2 = redis.createClient(address.port, address.host);

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
  getAddress: function() {
    'use strict';
    return address;
  },

  get: function(prefix, key, callback) {
    'use strict';
    return client.get(prefix + '_' + key, callback);
  },

  set: function(prefix, key, value, callback) {
    'use strict';
    return client.set(prefix + '_' + key, value, callback);
  },

  del: function(prefix, key) {
    'use strict';
    return client.del(prefix + '_' + key);
  },

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
