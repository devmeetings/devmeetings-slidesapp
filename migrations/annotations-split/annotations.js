'use strict';

if (process.argv.length !== 3) {
  console.error('you must set database name');
  process.exit(-1);
}

var MongoClient = require('mongodb').MongoClient,
  Q = require('q');

var mongoHost = process.env.MONGO_HOST || 'localhost';
var MONGO_URL = 'mongodb://' + mongoHost + '/' + process.argv[2];
console.log('migrating on ' + process.argv[2]);

var connectToMongo = function() {
  var result = Q.defer();
  MongoClient.connect(MONGO_URL, function(err, db) {
    if (err) {
      throw err;
    }
    result.resolve(db);
  });
  return result.promise;
};


function fixAnnotationInMaterial(eventId, iterationIdx, material, materialIdx) {
  var annotations = material.annotations;
  if (!(annotations && annotations.forEach)) {
    console.warn('Skipping update for ', eventId, iterationIdx, materialIdx);
    console.warn('Got annotations:', annotations);
    return;
  }

  db.collection('annotations').insert({
    annotations: annotations
  }, {}, function(err, doc) {
    if (err) {
      console.error("Cannot insert annotations for ", eventId, iterationIdx, materialIdx);
      console.error(err);
      return;
    }

    var annotationsPath = ['iterations', iterationIdx, 'materials', materialIdx, 'annotations'].join('.');
    var update = {};
    update[annotationsPath] = doc[0]._id;
    // Update events
    db.collection('events').update({
      _id: eventId
    }, {
      $set: update
    }, function(err) {
      if (err) {
        console.error('Couldnt update event', eventId, iterationIdx, materialIdx);
        console.error(err);
        return;
      }
      console.log("Updated.", eventId, iterationIdx, materialIdx);
    });
  });
}

var db;
connectToMongo().then(function(mongoDb) {
  db = mongoDb;

  db.collection('events').find({}).toArray(function(err, events) {
    events.map(function(event) {
      var it = event.iterations || [];
      it.map(function(iteration, idx) {
        var materials = iteration.materials || [];
        materials.map(
          fixAnnotationInMaterial.bind(null, event._id, idx)
        );
      });
    });
  });

});
