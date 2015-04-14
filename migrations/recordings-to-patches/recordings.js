'use strict';

if (process.argv.length !== 3) {
  console.error('you must set database name');
  process.exit(-1);
}

var MongoClient = require('mongodb').MongoClient,
  Q = require('q'),
  _ = require('lodash');

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


var jsondiffpatch = require('jsondiffpatch');

function newStatesave(date, current, id) {
  var first = {
    id: id,
    originalTimestamp: date,
    currentTimestamp: date,
    original: JSON.parse(JSON.stringify(current)),
    current: current,
    noOfPatches: 0,
    patches: []
  };

  return first;
}

function safeGet(key, obj, default2) {
  var arr = key.split('.');
  return arr.reduce(function(obj, k) {

    if (!obj) {
      return;
    }
    if (!obj[k]) {
      return default2;
    }
    return obj[k];

  }, obj);
}

function shouldSkip(code) {
  if (!code.workspace && !code.workspace.tabs) {
    return false;
  }

  var tabs = safeGet('workspace.tabs', code, {});
  var tabsNamesWithContent = Object.keys(tabs).filter(function(name){
    return tabs[name].content;
  });

  var uniqContent = _.uniq(tabsNamesWithContent.map(function(name) {
    return tabs[name].content;
  }));

  if (uniqContent.length !== tabsNamesWithContent.length) {
    return true;
  }

  var jsTabsWithHtml = Object.keys(tabs).filter(function(name) {
    return name.indexOf('js') !== -1;
  }).map(function(fileName) {
    return tabs[fileName].content;
  }).filter(function(tabContent) {
    return tabContent.indexOf('html>') !== -1;
  });

  var htmlTabsWithJs = Object.keys(tabs).filter(function(name) {
    return name.indexOf('htm') !== -1;
  }).map(function(fileName) {
    return tabs[fileName].content;
  }).filter(function(tabContent) {
    return tabContent.indexOf('function') !== -1;
  });

  if (jsTabsWithHtml.length || htmlTabsWithJs.length) {
    return true;
  }

  return false;
}

function convertSlidesToPatches(slides, rec) {

  var newSlides = [];

  var timestampDiff = 0;
  var first = newStatesave(rec.date, slides[0].code, 0);
  newSlides.push(first);


  slides.slice(1).map(function(snapshot) {
    var diff = jsondiffpatch.diff(first.current, snapshot.code);

    // Skip snapshots with no changes.
    if (!diff) {
      return;
    }

    if (shouldSkip(snapshot.code)) {
      return;
    }

    // Update current
    first.current = snapshot.code;

    first.patches.push({
      id: 'r' + rec._id + '_' + first.id + '_' + first.noOfPatches,
      timestamp: snapshot.timestamp - timestampDiff,
      patch: diff
    });
    first.noOfPatches += 1;
    first.currentTimestamp = new Date(first.originalTimestamp.getTime() + snapshot.timestamp);

    if (first.noOfPatches > 99) {
      timestampDiff = snapshot.timestamp;
      first = newStatesave(first.currentTimestamp, JSON.parse(JSON.stringify(first.current)), first.id + 1);
      newSlides.push(first);
    }
  });


  return newSlides;
}


var db;
connectToMongo().then(function(mongoDb) {
  db = mongoDb;

  console.log('Connected');
  var cur = db.collection('recordings').find({});

  cur.on('data', function(recording) {
    if (recording.slides[0].currentTimestamp) {
      return;
    }
    var newSlides = convertSlidesToPatches(recording.slides, recording);

    console.log('updating', recording._id);
    db.collection('recordings').update({
      _id: recording._id,
    }, {
      $set: {
        slides: newSlides
      }
    });
  });

  cur.once('end', function() {});

}).fail(function(err) {
  console.error(err);
  process.exit(-1);
});
