var xml = require("node-xml/lib/node-xml"),
    _ = require('lodash'),
    program = require('commander'),
    fs = require('fs');


program
    .option('-f, --file [type]', 'XML File')
    .option('-o, --output [type]', 'Output file')
    .parse(process.argv);

if (!program.file || !program.output) {
    console.log('You must provide both params');
    process.exit();
}

var video = {
    source: {},
    stitch: {},
    chapters: []
};


var attributesToMap = function (attrs) {
    return _.reduce(attrs, function (result, current) {
        result[current[0]] = current[1];
        return result;
    }, {});
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
        //console.log(video);
        //fs.writeFile(program.output, JSON.stringify(video, undefined, 2), function (err) {
            //console.log('output saved to: ', program.output);
        //});
        parseImportantData(video);
    });
});

parser.parseFile(program.file);

var parseImportantData = function (data) {
    var frameRegexp = /[^0-9]./;
    var framesPerSecond = parseInt(data.source.editRate.replace(frameRegexp, ''));
    var frameStart = parseInt(data.stitch.mediaStart.replace(frameRegexp, ''));
    var frameDuration = parseInt(data.stitch.duration);

    var secondStart = frameStart / framesPerSecond;
    var secondDuration = frameDuration / framesPerSecond;

    console.log('start:         ' + secondStart + 's , ' + frameStart % framesPerSecond);
    console.log('duration:      ' + secondDuration + 's , ' + frameDuration % framesPerSecond); 
    console.log('');
    console.log('');

    _.forEach(data.chapters, function (chapter) {
        var chapterStartFrame = parseInt(chapter.mediaStart.replace(frameRegexp, ''));
        var chapterDurationFrame = parseInt(chapter.duration);

        var chapterStartSecond = chapterStartFrame / framesPerSecond;
        var chapterDurationSecond = chapterDurationFrame / framesPerSecond;

        console.log('start:         ' + chapterStartSecond + 's , ' + chapterStartFrame % framesPerSecond);
        console.log('duration:      ' + chapterDurationSecond + 's , ' + chapterDurationFrame % framesPerSecond);
        console.log('');

    });

};


