#!/usr/bin/env node

var AdmZip = require('adm-zip'),
  https = require('https'),
  http = require('http'),
  path = require('path'),
  temp = require('temp'),
  fs = require('fs');


// Cleanup files 
temp.track();

var parse = require('./parse');

function fetchAndParse(file, cb) {
  'use strict';

  temp.mkdir('fetch', function(err, dirPath) {
    var tmpFile = path.join(dirPath, 'tmp.zip');
    var fileStream = fs.createWriteStream(tmpFile);

    var mod = file.indexOf('https') === 0 ? https : http;

    mod.get(file, function(stream) {

      stream.pipe(fileStream).on('error', function() {

        return cb('Problem writing to tmp stream: ' + tmpFile, null);

      }).on('finish', function() {

        var zip = new AdmZip(tmpFile);
        // Extract
        zip.extractAllTo(dirPath);
        // And Parse
        try {
          return cb(null, parse(dirPath, 'event.yml'));
        } catch (e) {
          return cb(e, null);
        }
      });

    }).on('error', function(err) {
      return cb(err, null);
    });
  });
}


if (require.main !== module) {
  exports.fetchAndParse = fetchAndParse;
  return;
}

if (process.argv.length < 3) {
  console.error('provide url with zip file');
  process.exit(-1);
}

var file = process.argv[2];

fetchAndParse(file, function(err, data) {
  'use strict';

  if (err) {
    console.error(err);
  } else {
    console.log(data);
  }
});
