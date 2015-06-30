'use strict';

var searchFor = '<script src="cordova.js"></script>';
var replaceWith = '<script src="/cdn/cordova/app1/cordova.js"></script>\n\t\t<script src="/cdn/cordova/app1/cordova_plugins.js"></script>';


if (process.argv.length < 3) {
  console.error('you must set database name');
  process.exit(-1);
}
if (process.argv.length < 4) {
  console.error('you must provide recording _id');
  process.exit(-1);
}
if (process.argv.length < 5) {
  console.error('you must provide filename');
  process.exit(-1);
}

var MongoClient = require('mongodb').MongoClient,
  MongoDb = require('mongodb'),
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

var file = process.argv[4];
var name = file.replace('.', '|');

function fixFile(slide) {
  if (!slide || !slide.workspace || !slide.workspace.tabs) {
    return;
  }
  var workspace = slide.workspace.tabs;
  if (!workspace[name]) {
    console.warn('Ignoring slide');
    return;
  }

  workspace[name].content = workspace[name].content.replace(searchFor, replaceWith);
  console.warn('Fixing');
}

var db;
connectToMongo().done(function(mongoDb) {
  db = mongoDb;

  console.log("connected");

  var _id = process.argv[3];

  db.collection('recordings').find({
    _id: MongoDb.ObjectID(_id)
  }).toArray(function(err, rec) {
    var recording = rec[0];
    if (!recording || err) {
      console.error("Not found: " + err);
      return;
    }

    recording.slides.map(function(slide) {
      fixFile(slide.original);
      fixFile(slide.current);
      slide.patches.map(function(patch) {
        fixFile(patch.patch);
      });
    });

    // Save back
    db.collection('recordings').update({
      _id: MongoDb.ObjectID(_id)
    }, recording, 
/*  
    delete recording._id;
    db.collection('recordings').insert(
      recording,*/
    function(err, o){
      console.log("Done", err, o._id);
    });
  });

});
