var parser = require('subtitles-parser'),
    fs = require('fs'),
    MongoClient = require('mongodb').MongoClient;

var config = require('../platform/config/config');

MongoClient.connect(config.db, function (err, db) {
    if (err) {
        throw err;
    }

    db.collection('snapshots').find().toArray( function (err, results) {
        console.dir(results);
        db.close();
    });
});
