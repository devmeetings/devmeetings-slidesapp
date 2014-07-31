var xml = require("node-xml/lib/node-xml"),
    _ = require('lodash');

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
            video.stitch = map;
        }

        if (elem === 'ScreenVMFile') {
            var map = attributesToMap(attrs);
            video.chapters.push(map);
        }
    });

    cb.onEndDocument(function() {
        console.log(video);
    });
});

parser.parseFile("./test/test0.xml");


