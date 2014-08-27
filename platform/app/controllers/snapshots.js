var config = require('../../config/config');
var MongoBridge = require('../services/raw-mongo-bridge');
var SnapshotsParser = require('../services/snapshots-parser');


function findSnapshots(connection, startTime, endTime, offset, groupTime, title) {
    return connection.then(function(mongo) {
        return mongo.getSnapshots(startTime, endTime);
    }).then(function(snaps) {
        return SnapshotsParser.prepareRecordings(false, snaps, offset, groupTime, title);
    });
}

function parseParams(req) {
    var startTime = new Date(req.params.startTime).getTime(),
        endTime = new Date(req.query.endTime || (startTime ? startTime + 1000 * 3600 * 24 : Date.now())).getTime(),
        offset = parseInt(req.query.offset, 10) || 0,
        showLast = !!req.query.showLast,
        groupTime = parseInt(req.query.groupTime, 10) || 60 * 2,
        title = req.query.title || "";

    return {
        startTime: startTime,
        endTime: endTime,
        offset: offset,
        showLast: showLast,
        title: title,
        groupTime: groupTime * 1000 * 60
    };
}

exports.list = function(req, res) {
    var params = parseParams(req);
    findSnapshots(MongoBridge(config.db), params.startTime, params.endTime, params.offset, params.groupTime, params.title)
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
                    rec.time = last.timestamp / 1000 / 60 + " min";
                    return rec;
                })
            });
        }).fail(function(err) {
            res.send(400, err);
        });
};

exports.import = function(req, res) {
    var params = parseParams(req);
    var connection = MongoBridge(config.db);
    findSnapshots(connection, params.startTime, params.endTime, params.offset, params.groupTime, params.title)
        .then(function(recordings) {
            connection.then(function(mongo) {
                mongo.saveRecordings(recordings).then(function() {
                    res.send(200);
                });
            });
        }).fail(function(err) {
            res.send(400, err);
        });
};