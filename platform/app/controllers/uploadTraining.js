var _ = require('lodash'),
    Q = require('q'),
    fs = require('fs'),
    srt = require('srt'),
    path = require('path'),
    config = require('../../config/config'),
    Training = require('../models/training'),
    Recording = require('../models/recording'),
    MongoBridge = require('../services/raw-mongo-bridge');

var soundsDir = path.join(__dirname, '..', '..', 'public', 'sounds');
var soundsUrl = '/static/sounds/';

var idPattern = /ID\: (.+)$/;

exports.upload = function(req, res) {
    var title = req.body.title;
    if (!title) {
        res.send(400, "No title!");
        return;
    }

    // Read SRT
    Q.nfcall(srt, req.files.captions.path).then(function(captions) {
        captions = _.values(captions);
        // convert captions to recordings
        var slides = captions.map(function(caption) {
            var id = idPattern.exec(caption.text)[1];

            return {
                timestamp: caption.startTime,
                snapshotId: id
            };
        });


        // fetch appropriate slides
        return MongoBridge(config.db).then(function(mongo) {
            var toFetch = slides.map(function(s) {
                return s.snapshotId;
            });
            return mongo.getRawRecordingsByIds(toFetch);
        }).then(function(recordings) {
            // Create a set
            var slideSet = recordings.reduce(function(acc, rec) {
                acc[rec._id] = rec;
                return acc;
            }, {});

            // map slides
            var slidesContent = slides.map(function(slide) {
                var s = slideSet[slide.snapshotId];
                s.timestamp = slide.timestamp;
                return s;
            });

            // Create recording
            return Q.ninvoke(Recording, 'create', {
                title: title,
                group: title,
                date: new Date(),
                slides: slidesContent
            });
        }).then(function(recording) {
            // Rename audio
            var audioPath = path.join(soundsDir, req.files.audio.name);
            var audio = Q.ninvoke(fs, 'rename', req.files.audio.path, audioPath);

            // Create training
            var training = Q.ninvoke(Training, 'create', {
                title: title,
                chapters: [{
                    title: title,
                    mode: 'video',
                    videodata: {
                        url: soundsUrl + req.files.audio.name,
                        timestamp: 0,
                        recordingTime: 0,
                        length: _.last(recording.slides).timestamp + 100,
                        recording: recording._id
                    }
                }]
            });

            return Q.all([audio, training]);
        }).then(function(data) {
            res.send(data[1]);
        });
    }).done(null, function(err) {
        console.error(err);
        res.send(400, err.toString());
        throw err;
    });
};