var Cache = require('../models/cache');
var level = require('level');
var cap = require('level-capped');
var Q = require('q');

var instance = process.env.NODE_APP_INSTANCE || 0;
var databaseLocation = __dirname + '/../../data/' + instance + '/';
var db = level(databaseLocation);

cap(db, 'cache', 5000);

function findCacheInMongo (key) {
  'use strict';
  return Q.when(Cache.findOne({
    key: key
  }).exec());
}

function putToCacheInMongo (key, value) {
  'use strict';
  // [ToDr] Using upsert here to gently overcome possible race conditions.
  return Q.when(Cache.update({
    key: key
  }, {
    $setOnInsert: {
      key: key,
      createdAt: new Date(),
      content: value
    }
  }, {
    upsert: true
  }));
}

function findCacheInLevel (key) {
  'use strict';
  return Q.ninvoke(db, 'get', 'cache!' + key).then(function (data) {
    return JSON.parse(data);
  });
}

function putToCacheInLevel (key, value) {
  'use strict';
  return Q.ninvoke(db, 'put', 'cache!' + key, JSON.stringify({
    key: key,
    date: new Date(),
    content: value
  }));
}

module.exports = {
  get: function (key, generatingFunction) {
    'use strict';

    var that = this;

    return Q.any([findCacheInMongo(key), findCacheInLevel(key)]).then(function (doc) {
      if (doc) {
        return doc.content;
      }

      // Populate cache
      return Q.when(generatingFunction(key)).then(function (doc) {
        return that.populate(key, doc).then(function () {
          return doc;
        });
      });
    });
  },

  populate: function (key, value) {
    'use strict';

    return Q.any([putToCacheInMongo(key, value), putToCacheInLevel(key, value)]);
  }

};
