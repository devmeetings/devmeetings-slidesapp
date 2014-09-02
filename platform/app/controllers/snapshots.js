var config = require('../../config/config');
var MongoBridge = require('../services/raw-mongo-bridge');
var SnapshotsParser = require('../services/snapshots-parser');

var jsdiff = require('diff');


function findSnapshots(connection, options) {
    var startTime = options.startTime;
    var endTime = options.endTime;

    return connection.then(function(mongo) {
        return mongo.getSnapshots(startTime, endTime);
    }).then(function(snaps) {
        return SnapshotsParser.prepareRecordings(false, snaps, options);
    });
}

function parseParams(req) {
    var startTime = new Date(req.params.startTime).getTime(),
        endTime = new Date(req.query.endTime || (startTime ? startTime + 1000 * 3600 * 24 : Date.now())).getTime(),
        offset = parseInt(req.query.offset, 10) || 0,
        showLast = !!req.query.showLast,
        groupTime = parseInt(req.query.groupTime, 10) || 60 * 2,
        title = req.query.title || "",
        group = req.query.group || null,
        oldSchool = !!req.query.oldSchool;

    return {
        oldSchool: oldSchool,
        startTime: startTime,
        endTime: endTime,
        timeoffset: offset,
        showLast: showLast,
        title: title,
        group: group,
        groupTime: groupTime * 1000 * 60
    };
}

exports.list = function(req, res) {
    if (req.query.action !== 'get') {
        res.send(401);
        return;
    }
    var params = parseParams(req);
    findSnapshots(MongoBridge(config.db), params)
        .then(function(recordings) {
            res.send({
                startTime: new Date(params.startTime),
                endTime: new Date(params.endTime),
                offset: params.timeoffset,
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
            console.error(err);
            res.send(400, err);
        });
};

exports.import = function(req, res) {
    if (req.query.action !== 'import') {
        res.send(401);
        return;
    }
    var params = parseParams(req);
    var connection = MongoBridge(config.db);
    findSnapshots(connection, params)
        .then(function(recordings) {
            return connection.then(function(mongo) {
                return mongo.saveRecordings(recordings);
            }).then(function() {
                res.send(200);
            });
        }).fail(function(err) {
            console.error(err);
            res.send(400, err.toString());
        });
};

exports.convert = function(req, res) {
    if (req.query.action !== 'convert') {
        res.send(401);
        return;
    }
    var params = parseParams(req);
    var connection = MongoBridge(config.db);

    params.dontConvertTimestamps = true;
    findSnapshots(connection, params).then(function(recordings) {

        var rawRecordings = parseToRawRecordings(recordings);
        return connection.then(function(mongo) {
            return mongo.saveRawRecordings(rawRecordings);
        }).then(function() {
            res.send(200);
        });
    }).fail(function(err) {
        console.error(err);
        res.send(400, err.toString());
    });
};

exports.getRawRecordings = function(req, res) {
    var connection = MongoBridge(config.db);
    connection.then(function(mongo) {
        return mongo.getRawRecordings(req.params.group);
    }).then(function(recordings) {
        if (!req.query.format || req.query.format === 'json') {
            res.send(recordings);
        } else {
            res.set('Content-Type', 'text/plain');
            res.send(convertRawRecordings(recordings, req.query.format));
        }
    }).fail(function(err) {
        console.error(err);
        res.send(400, err.toString());
    });
};

exports.getRawRecordingsGroups = function(req, res) {
    var connection = MongoBridge(config.db);
    connection.then(function(mongo) {
        return mongo.getRawRecordingsGroups();
    }).then(function(groups) {

        res.send(groups);
    }).fail(function(err) {
        console.error(err);
        res.send(400, err.toString());
    });
};


function parseToRawRecordings(recordings) {
    return recordings.reduce(function(acc, rec) {
        var meta = {
            group: rec.group,
            date: rec.date,
            title: rec.title
        };

        return rec.slides.reduce(function(acc, slide) {
            slide.meta = meta;
            acc.push(slide);
            return acc;
        }, acc);
    }, []);
}

function convertRawRecordings(slides) {
    var getData = function(slide) {
        return [
            slide._id,
            slide.recordingStarted ? "--------- Start ---------" : "Date: " + slide.meta.date,
            "Group: " + slide.meta.group,
            "Title: " + slide.meta.title,
        ];
    };
    // Convert to SRT
    var srt = slides.reduce(function(data, slide) {
        if (!data.last) {
            data.last = slide;
            return data;
        }

        // Print previous slide
        data.slides.push({
            from: data.last.timestamp,
            to: slide.timestamp,
            data: getData(slide).concat(calculateDiff(data.last, slide))
        });

        data.last = slide;
        return data;
    }, {
        last: null,
        slides: []
    });

    // add Last slide
    srt.slides.push({
        from: srt.last.timestamp,
        to: srt.last.timestamp + 10,
        data: getData(srt.last)
    });

    return asSrt(srt.slides);
}

function filterObj(obj, propsToFilter) {
    var cp = JSON.parse(JSON.stringify(obj));
    propsToFilter.forEach(function(part) {
        delete cp[part];
    });
    return JSON.stringify(cp);
}

function calculateDiff(prev, current) {
    var filter = ['meta', 'timestamp', 'recordingStarted', '_id'];
    var prevStr = filterObj(prev, filter);
    var currentStr = filterObj(current, filter);


    return jsdiff.diffWords(prevStr, currentStr).filter(function(part) {
        // remove unchanged parts
        return part.added || part.removed;
    }).filter(function(part) {
        // Remove numbers
        return parseFloat(part.value) + "" !== part.value;
    }).map(function(part) {
        if (part.added) {
            return "[+] " + part.value;
        }
        if (part.removed) {
            return "[-] " + part.value;
        }
    }).map(function(txt) {
        return txt.replace(/\n/g, ' ');
    });
}

function asSrt(data) {
    return data.reduce(function(buffer, entry, k) {
        // number
        buffer.push(k + 1);
        //time
        buffer.push(formatTime(entry.from) + " --> " + formatTime(entry.to));
        // data
        buffer.push.apply(buffer, entry.data);
        // empty entry
        buffer.push("");

        return buffer;
    }, []).join("\n");
}

function formatTime(timestamp) {
    var ms = timestamp % 1000;
    timestamp = parseInt(timestamp / 1000, 10);
    var s = timestamp % 60;
    timestamp = parseInt(timestamp / 60, 10);
    var min = timestamp % 60;
    timestamp = parseInt(timestamp / 60, 10);
    var hours = timestamp % 24;
    return [hours, min, s].join(':') + ',' + ms;
}