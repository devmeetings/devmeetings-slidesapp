var fs = require('fs'),
    MongoClient = require('mongodb').MongoClient,
    LZString = require('lz-string'),
    _ = require('lodash');

var config = require('../../platform/config/config');

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

    db.collection('snapshots').find({
        timestamp: {
            $gte: 1406745240000
        }
    }).toArray( function (err, results) {

        var sortedResults = _.sortBy(results, function (elem) {
            return elem.timestamp;

        });
//        var time = 2 * 60 * 60 * 1000; // 2 hours     
        var time = 5 * 60 * 1000; // 2 minutes
        var snaps = _.reduce(sortedResults, function (acc, elem) {
            var last = _.last(acc);
            if (last !== undefined && last.slideId === elem.slideId.toString() && elem.timestamp < last.timestamp + time){
//            if (last !== undefined && elem.timestamp < last.timestamp + time) {
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

            var date = new Date(snap.timestamp);
            var dateString = date.toDateString();
            var title = snap.slides[0].code.title;
            return {
                slides: snap.slides,
                slideId: snap.slideId,
                group: dateString,
                date: date,
                title: 'angular_no_sound2' // title ? title : ""
            }
        });

        db.collection('recordings').insert(finalSnaps, function (err, insertedSnaps) {
            if (err) {
                throw err;
            }
            console.log('imported ' + insertedSnaps.length + ' recordings');
            db.close();
        });
    });
});
