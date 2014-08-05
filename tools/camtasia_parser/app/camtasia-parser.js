var Q = require('q'),
    xml = require('node-xml'),
    _ = require('lodash');


var attributesToMap = function (attrs) {
    return _.reduce(attrs, function (result, current) {
        result[current[0]] = current[1];
        return result;
    }, {});
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
    }
};

module.exports = CamtasiaParser;
