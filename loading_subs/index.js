var fs = require('fs'),
    MongoClient = require('mongodb').MongoClient,
    LZString = require('lz-string'),
    _ = require('lodash');

var config = require('../platform/config/config');

MongoClient.connect(config.db, function (err, db) {
    if (err) {
        throw err;
    }

    db.collection('snapshots').find().toArray( function (err, results) {
        var datas = _.pluck(results, 'data');

        var snaps = [];
        _.forEach(datas, function (elem) {
            var decompressed = JSON.parse(LZString.decompressFromBase64(elem));
            snaps = snaps.concat(decompressed);
        }, []);

        console.log(snaps);
        console.log(_.pluck(_.pluck(snaps, 'code'), 'code'));

        db.close();
    });
});
