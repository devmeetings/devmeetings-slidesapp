var redis = require('redis');
var redisUrl = require('redis-url');
var redisStore = require('connect-redis');
var redisAdapter = require('socket.io-redis');

var config = require('./config');
var logger = require('./logging');

logger.info('Connecting to Redis', config.store);
var redisAddress = redisUrl.parse(config.store);

var client = redis.createClient(redisAddress.port, redisAddress.hostname);
var client2 = redis.createClient(redisAddress.port, redisAddress.hostname);

client.on('error', function (err) {
  'use strict';

  logger.error('Redis failure', err);
  throw err;
});

module.exports = {
  client: client,
  client2: client2,

  getSocketsAdapter: function () {
    'use strict';
    var url = redisUrl.parse(config.store);
    return redisAdapter({
      host: url.hostname,
      port: url.port
    });
  },

  sessionStore: function (session) {
    'use strict';

    var RedisStore = redisStore(session);
    return new RedisStore({
      client: client
    });
  }
};
