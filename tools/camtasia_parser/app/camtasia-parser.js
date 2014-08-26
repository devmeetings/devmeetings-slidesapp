var Q = require('q'),
    xml = require('node-xml'),
    _ = require('lodash');


var attributesToMap = function(attrs) {
    return _.reduce(attrs, function(result, current) {
        result[current[0]] = current[1];
        return result;
    }, {});
};

var parseChapters = function(data) {
    var result = {};

    var frameRegexp = /[^0-9]./;
    var framesPerSecond = parseInt(data.source.editRate.replace(frameRegexp, ''));
    var frameStart = parseInt(data.stitch.mediaStart.replace(frameRegexp, ''));
    var frameDuration = parseInt(data.stitch.duration);

    var secondStart = frameStart / framesPerSecond;
    var secondDuration = frameDuration / framesPerSecond;

    return _.map(data.chapters, function(chapter) {
        var chapterStartFrame = parseInt(chapter.mediaStart.replace(frameRegexp, ''));
        var chapterDurationFrame = parseInt(chapter.duration);

        var chapterStartSecond = chapterStartFrame / framesPerSecond;
        var chapterDurationSecond = chapterDurationFrame / framesPerSecond;

        return {
            start: chapterStartSecond,
            duration: chapterDurationSecond
        };
    });
};


var CamtasiaParser = {
    parseFile: function(filename) {

        var result = Q.defer();
        var video = {
            source: {},
            stitch: {},
            chapters: []
        };

        var parser = new xml.SaxParser(function(cb) {
            cb.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {
                if (elem === 'SourceTrack') {
                    var map = attributesToMap(attrs);
                    if (map.type === '0') {
                        video.source = map;
                    }
                }

                if (elem === 'StitchedMedia') {
                    var map = attributesToMap(attrs);
                    if (video.chapters.length === 0) {
                        video.stitch = map;
                    }
                }

                if (elem === 'ScreenVMFile') {
                    var map = attributesToMap(attrs);
                    video.chapters.push(map);
                }
            });

            cb.onEndDocument(function() {
                result.resolve(video);
                //parseImportantData(video);
            });
        });

        parser.parseFile(filename);

        return result.promise;
    },
    parseChapters: function(filename) {
        return this.parseFile(filename).then(parseChapters);
    }
};

module.exports = CamtasiaParser;