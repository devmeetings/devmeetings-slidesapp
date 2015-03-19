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

function fetchAndParse(file, wd, cb) {
  temp.mkdir('fetch', function(err, dirPath) {
    var tmpFile = path.join(dirPath, 'tmp.zip');
    var fileStream = fs.createWriteStream(tmpFile);

    var mod = file.indexOf('https') === 0 ? https : http;

    mod.get(file, function(stream) {

      stream.pipe(fileStream).on('error', function() {

        return cb("Problem writing to tmp stream: " + tmpFile, null);

      }).on('finish', function() {

          var zip = new AdmZip(tmpFile);
          // Extract
          zip.extractAllTo(dirPath);
          // And Parse
          return cb(null, parse(dirPath, 'event.yml'));

      });

    }).on('error', function(err) {
      return cb(err, null);
    });
  });
}


if (require.main === module) {

  if (process.argv.length < 3) {
    console.error("provide url with zip file");
    process.exit(-1);
  }

  var file = process.argv[2];

  fetchAndParse(file, __dirname, function(err, data) {
    if (err) {
      console.error(err);
    } else {
      console.log(data);
    }
  });
} else {
  exports.fetchAndParse = fetchAndParse;
}
