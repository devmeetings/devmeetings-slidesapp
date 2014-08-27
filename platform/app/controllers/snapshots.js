var config = require('../../config/config');
var MongoBridge = require('../services/raw-mongo-bridge');
var SnapshotsParser = require('../services/snapshots-parser');


function findSnapshots(connection, startTime, endTime, offset, title) {
    return connection.then(function(mongo) {
        return mongo.getSnapshots(startTime, endTime);
    }).then(function(snaps) {
        return SnapshotsParser.prepareRecordings(false, snaps, offset, title);
    });
}

function parseParams(req) {
    var startTime = new Date(req.params.startTime).getTime(),
        endTime = new Date(req.query.endTime || (startTime ? startTime + 1000 * 3600 * 24 : Date.now())).getTime(),
        offset = parseInt(req.query.offset || 0, 10),
        showLast = !!req.query.showLast,
        title = req.query.title || "";

    return {
        startTime: startTime,
        endTime: endTime,
        offset: offset,
        showLast: showLast,
        title: title
    };
}

exports.list = function(req, res) {
    var params = parseParams(req);
    findSnapshots(MongoBridge(config.db), params.startTime, params.endTime, params.offset, params.title)
        .then(function(recordings) {
            res.send({
                startTime: new Date(params.startTime),
                endTime: new Date(params.endTime),
                offset: params.offset,
                recordings: recordings.map(function(rec) {
                    var last = rec.slides[rec.slides.length - 1];
                    if (params.showLast) {
                        rec.lastSlide = last;
                    }
                    rec.slides = rec.slides.length;
                    return rec;
                })
            });
        });
};

exports.import = function(req, res) {
    var params = parseParams(req);
    var connection = MongoBridge(config.db);
    findSnapshots(connection, params.startTime, params.endTime, params.offset, params.title)
        .then(function(recordings) {
            connection.then(function(mongo) {
                mongo.saveRecordings(recordings).then(function() {
                    res.send(200);
                });
            });
        });
};