var Cache = require('../models/cache'),
  Q = require('q');


module.exports = {

  get: function(key, generatingFunction) {
    'use strict';

    var that = this;
    return Q.when(Cache.findOne({
      key: key
    }).exec()).then(function(doc) {
      if (doc) {
        return doc.content;
      }

      // Populate cache
      return Q.when(generatingFunction(key)).then(function(doc) {
        return that.populate(key, doc).then(function() {
          return doc;
        });
      });
    });
  },

  populate: function(key, value) {
    'use strict';

    //[ToDr] Using upsert here to gently overcome possible race conditions.
    return Q.when(Cache.create({
      key: key,
      createdAt: new Date(),
      content: value
    })).fail(function() {
      // Silently ignore error
      return null;
    });
  }

};
