var Q = require('q'),
    _ = require('lodash'),
    LZString = require('lz-string');




var isChapterSlide = function(chapters, slide) {
    var result = false;
    var slideSecond = slide.timestamp / 1000;
    for (var i = 0; i < chapters.length && result === false; i++) {
        var chapter = chapters[i];
        // TODO [ToDr] Does this loop quits when result is true? Maybe short if instead?
        result = slideSecond > chapter.start && slideSecond < (chapter.start + chapter.duration);
    }
    return result;
};

var oldSchoolReduce = function(snapshots, groupTime, title) {

    var createNewGroup = function(snap) {
        return {
            userId: '',
            timestamp: snap.timestamp,
            title: title + " (" + (snap.code.title || snap.code.name) + ")",
            slides: [snap]
        };
    };

    return snapshots.reduce(function(acc, snap) {
        if (acc.last && snap.timestamp < acc.last.timestamp + groupTime) {
            acc.last.slides.push(snap);
        } else {
            // start new group
            acc.last = createNewGroup(snap);
            acc.groups.push(acc.last);
        }
        return acc;
    }, {
        groups: [],
        last: null
    }).groups;
};

var reduceSnapshots = function(snapshots, options) {
    var groupTime = options.groupTime;
    var title = options.title;

    var allSnaps = _.reduce(snapshots, function(acc, elem) {
        return acc.concat(JSON.parse(LZString.decompressFromBase64(elem.data)));
    }, []);
    var allSnapsGroupped = allSnaps.reduce(function(data, snap) {
        if (snap.code.recordingStarted || !data.last) {
            data.last = {
                // TODO [ToDr] we don't know user!
                userId: '',
                timestamp: snap.code.recordingStarted || snap.timestamp,
                title: title + " (" + (snap.code.title || snap.code.name) + ")",
                slides: [snap]
            };
            data.groups.push(data.last);
        } else {
            data.last.slides.push(snap);
        }
        return data;
    }, {
        groups: [],
        last: null
    });

    var groups = allSnapsGroupped.groups.filter(function(x) {
        // Remove multiple starts
        return x.slides.length > 1;
        //return true;
    });

    if (options.oldSchool) {
        // In first group we have to do some old school grouping
        var moreGroups = oldSchoolReduce(groups[0].slides, groupTime, title);
        return moreGroups.concat(groups);
    }
    return groups;
};


var keysToTrim = ['live-save', 'toolbar', 'commit'];
var snapshotTrimmer = function(object) {
    var keys = _.keys(object);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (_.contains(keysToTrim, key)) {
            delete object[key];
        } else {
            snapshotTrimmer(object[key]);
        }
    }
};

var produceFinalSnaps = function(snaps, chapters, timeoffset, group) {
    return _.map(snaps, function(snap) {
        var beginTime = snap.slides[0].timestamp;
        _.forEach(snap.slides, function(slide) {
            slide.timestamp -= beginTime;
            slide.timestamp += (timeoffset * 1000);
        });

        if (chapters) {
            snap.slides = _.filter(snap.slides, function(slide) {
                return isChapterSlide(chapters, slide);
            });
        }

        var date = new Date(snap.timestamp);
        var niceDate = date.toDateString() + " " + date.toTimeString().substr(0, 8);
        var title = snap.title;
        console.log("Found recording: " + title, niceDate);
        return {
            slides: snap.slides,
            group: group ? group : title + " " + niceDate,
            date: date,
            title: title
        };
    });
};

var SnapshotsParser = {
    prepareRecordings: function(chapters, snapshots, options) {
        var result = Q.defer();
        var snaps = reduceSnapshots(snapshots, options);
        snapshotTrimmer(snaps);
        var finalSnaps = produceFinalSnaps(snaps, chapters, options.timeoffset, options.group);
        result.resolve(finalSnaps);

        return result.promise;
    }
};


module.exports = SnapshotsParser;