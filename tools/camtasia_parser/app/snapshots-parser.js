var Q = require('q'), 
    _ = require('lodash'),
    LZString = require('lz-string');


var parseImportantData = function (data) {
    var result = {};

    var frameRegexp = /[^0-9]./;
    var framesPerSecond = parseInt(data.source.editRate.replace(frameRegexp, ''));
    var frameStart = parseInt(data.stitch.mediaStart.replace(frameRegexp, ''));
    var frameDuration = parseInt(data.stitch.duration);

    var secondStart = frameStart / framesPerSecond;
    var secondDuration = frameDuration / framesPerSecond;

    result.chapters = _.map(data.chapters, function (chapter) {
        var chapterStartFrame = parseInt(chapter.mediaStart.replace(frameRegexp, ''));
        var chapterDurationFrame = parseInt(chapter.duration);

        var chapterStartSecond = chapterStartFrame / framesPerSecond;
        var chapterDurationSecond = chapterDurationFrame / framesPerSecond;

        return {
            start: chapterStartSecond,
            duration: chapterDurationSecond
        };
    });
    return result;
};

var isImportantSlide = function (importantData, slide) {        
    var result = false;
    var slideSecond = slide.timestamp / 1000;
    for (var i = 0; i < importantData.chapters.length && result === false; i++) {
        var chapter = importantData.chapters[i];
        result = slideSecond > chapter.start && slideSecond < (chapter.start + chapter.duration);
    }
    return result;
};

var reduceSnapshots = function (snapshots) {

    var time = 2 * 60 * 60 * 1000; // 2 hours     
    return _.reduce(snapshots, function (acc, elem) {
        var last = _.last(acc);
        if (last !== undefined && elem.timestamp < last.timestamp + time) {            // ignore date ?
            last.timestamp = elem.timestamp; // is it still necessary? 
            last.slides = last.slides.concat(JSON.parse(LZString.decompressFromBase64(elem.data)));
        } else {
            last = {
                slideId: elem.slideId.toString(),
                userId: elem.userId,
                timestamp: elem.timestamp,
                slides: JSON.parse(LZString.decompressFromBase64(elem.data))
            };
            console.log(elem.timestamp);
            acc.push(last);
        }
        return acc;
    }, []);
};


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

var produceFinalSnaps = function (snaps, importantData, timeoffset) {
    return _.map(snaps, function (snap) { 
        var beginTime = snap.slides[0].timestamp;
        _.forEach(snap.slides, function (slide) {
            slide.timestamp -= beginTime;
            slide.timestamp += (timeoffset * 1000);
        });

        snap.slides = _.filter(snap.slides, function (slide) {
            return isImportantSlide(importantData, slide);
        });

        var date = new Date(snap.timestamp);
        var dateString = date.toDateString();
        var title = snap.slides.length > 0 ? snap.slides[0].code.title : 'no slides';
        return {
            slides: snap.slides,
           slideId: snap.slideId,
           group: dateString,
           date: date,
           title: title ? title : ""
        };
    });
};

var SnapshotsParser = {
    prepareRecordings: function (videodata, snapshots, timeoffset) {
        var result = Q.defer();
        var importantData = parseImportantData(videodata);      
        var snaps = reduceSnapshots(snapshots);
        snapshotTrimmer(snaps);
        var finalSnaps = produceFinalSnaps(snaps, importantData, timeoffset);
        result.resolve(finalSnaps);

        return result.promise;
    }
};


module.exports = SnapshotsParser;
