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

module.exports = {
  client: client,
  client2: client2,

  getAddress: function() {
    'use strict';
    return address;
  },

  sessionStore: function(session) {
    'use strict';

    var RedisStore = redisStore(session);
    return new RedisStore({
      client: client
    });
  }
};
