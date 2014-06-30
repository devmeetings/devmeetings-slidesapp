var fs = require('fs'),
    MongoClient = require('mongodb').MongoClient,
    LZString = require('lz-string'),
    _ = require('lodash');

var config = require('../platform/config/config');

var keysToTrim = ['live-save', 'toolbar', 'commit'];

var snapshotTrimmer = function (object) {
    var keys = _.keys(object);
    for (var i = 0; i < keys.length; i++){
        var key = keys[i];
        if (_.contains(keysToTrim, key)){
            delete object[key];
        } else {
            snapshotTrimmer(object[key]);
        }
    }
};

MongoClient.connect(config.db, function (err, db) {
    if (err) {
        throw err;
    }

    db.collection('snapshots').find().toArray( function (err, results) {

        var sortedResults = _.sortBy(results, function (elem) {
            return elem.timestamp;

        });
        var snaps = _.reduce(sortedResults, function (acc, elem) {
            var last = _.last(acc);
            if (last !== undefined && last.slideId === elem.slideId.toString() && last.userId === elem.userId && elem.timestamp < last.timestamp + 60000){
                last.timestamp = elem.timestamp;
                last.slides = last.slides.concat(JSON.parse(LZString.decompressFromBase64(elem.data)));
            } else {
                last = {
                    slideId: elem.slideId.toString(),
                    userId: elem.userId,
                    timestamp: elem.timestamp,
                    slides: JSON.parse(LZString.decompressFromBase64(elem.data))
                };
                acc.push(last);
            }
            return acc;
        }, [
        ]);

        snapshotTrimmer(snaps);
        var finalSnaps = _.map(snaps, function (snap) {
            var beginTime = snap.slides[0].timestamp;
            _.forEach(snap.slides, function (slide) {
                slide.timestamp -= beginTime;
            });
            return {
                slides: snap.slides,
                slideId: snap.slideId
            }
        });

        console.log(finalSnaps);
        db.collection('recordings').insert(finalSnaps, function (err, insertedSnaps) {
            if (err) {
                throw err;
            }
            db.close();
        });
    });
});
