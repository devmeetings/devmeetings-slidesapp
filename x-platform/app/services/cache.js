var Q = require('q');

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

module.exports = {
  get: function (key, generatingFunction) {
    'use strict';

    var that = this;
    var doc = cache.get(key);

    if (doc) {
      return Q.when(doc.content);
    }

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
