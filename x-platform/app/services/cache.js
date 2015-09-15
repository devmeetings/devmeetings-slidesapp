var Q = require('q');
var logger = require('../../config/logging');

var cache = {
  map: {},
  keys: [],
  cap: 5000,

  put: function (key, value) {
    this.map[key] = value;
    this.keys.push(key);
    this.cleanup();
  },

  get: function (key) {
    return this.map[key];
  },

  cleanup: function () {
    while (this.keys.length > this.cap) {
      var key = this.keys.shift();
      delete this.map[key];
    }
  }
};

var cacheStats = {
  requests: 0,
  hits: 0,
  logEvery: 1000,

  log: function (isHit) {
    this.requests += 1;
    if (isHit) {
      this.hits += 1;
    }
    if (this.requests % this.logEvery === 0) {
      var rate = this.hits / this.requests * 100;
      logger.info('Cache statistics: ' + this.requests + '/' + this.hits + '; ' + rate.toFixed(2) + '%');
    }
  }
};

module.exports = {
  get: function (key, generatingFunction) {
    'use strict';

    var that = this;
    var doc = cache.get(key);

    if (doc) {
      cacheStats.log(true);
      return Q.when(doc.content);
    }

    cacheStats.log(false);
    // Populate cache
    return Q.when(generatingFunction(key)).then(function (doc) {
      return that.populate(key, doc).then(function () {
        return doc;
      });
    });
  },

  populate: function (key, value) {
    'use strict';
    return Q.when(cache.put(key, value));
  }

};
