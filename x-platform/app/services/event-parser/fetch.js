#!/usr/bin/env node

var AdmZip = require('adm-zip');
var https = require('https');
var http = require('http');
var path = require('path');
var temp = require('temp');
var fs = require('fs');

// Cleanup files
temp.track();

var parse = require('./parse');

function openStream (file, cb, func) {
  'use strict';

  if (file.indexOf('https') === 0) {
    return https.get(file, func);
  }

  if (file.indexOf('http') === 0) {
    return http.get(file, func);
  }
  var rs = fs.createReadStream(file);
  func(rs);
  return rs;
}

function fetchAndParse (file, cb) {
  'use strict';

  temp.mkdir('fetch', function (err, dirPath) {
    if (err) {
      throw err;
    }
    var tmpFile = path.join(dirPath, 'tmp.zip');
    var fileStream = fs.createWriteStream(tmpFile);

    openStream(file, cb, function (stream) {
      stream.pipe(fileStream).on('error', function () {
        return cb('Problem writing to tmp stream: ' + tmpFile, null);

      }).on('finish', function () {
        var zip = new AdmZip(tmpFile);
        // Extract
        zip.extractAllTo(dirPath);
        var entries = zip.getEntries().map(function (entry) {
          return entry.entryName;
        }).filter(function (entryName) {
          return entryName.indexOf('event.yml') > -1;
        });
        var firstDir = entries[0].split('/');
        dirPath = path.join.apply(path, [dirPath].concat(firstDir.slice(0, firstDir.length - 1)));
        // And Parse
        try {
          return cb(null, parse(dirPath, 'event.yml'));
        } catch (e) {
          return cb(e, null);
        }
      });

    });

  });
}

if (require.main !== module) {
  exports.fetchAndParse = fetchAndParse;
} else {
  if (process.argv.length < 3) {
    console.error('provide url with zip file');
    process.exit(-1);
  }

  var file = process.argv[2];

  fetchAndParse(file, function (err, data) {
    'use strict';

    if (err) {
      console.error(err);
    } else {
      console.log(data);
    }
  });
}
