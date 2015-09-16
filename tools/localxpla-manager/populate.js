var fs = require('fs');
var Q = require('q');
var request = require('request');
var mkdirpOrig = require('mkdirp');

var req = Q.denodeify(request);
var mkdirp = Q.denodeify(mkdirpOrig);

var SERVER_PATH = process.env.SERVER_PATH || 'http://localhost:4000';
var WRITE_PATH = './public';

module.exports = function populateCache (logsPath) {
  var logStream = fs.createWriteStream(logsPath);
  function log (tag, msg) {
    console.log('[' + tag + ']', msg);
    logStream.write(new Date() + '  [' + tag.toUpperCase() + '] ' + msg + '\n');
  }

  log('auth', 'Logging to xplatform: ' + SERVER_PATH);

  var jar = request.jar();
  return req({
    url: '/auth/login',
    baseUrl: SERVER_PATH,
    method: 'POST',
    body: {
      email: 'test@todr.me',
      password: 'testpass'
    },
    jar: jar,
    json: true
  }).then(
    function (res) {
      log('auth', 'Logged in. Asking for recordings');
      // Ask for recordings
      return req({
        url: SERVER_PATH + '/api/recordings',
        jar: jar
      }).then(function (res) {
        if (res[0].statusCode !== 200) {
          console.error(res[1]);
          throw res[1];
        }

        var recordings = JSON.parse(res[1]);
        return Q.all(
          recordings.map(function (rec) {
            log('recordings', 'Fetching recording: ' + rec._id + ' ' + rec.title);
            return Q.all([
              fetchAndSave('/api/recordings/' + rec._id, '', '/index.json', jar, log),
              fetchAndSave('/api/recordings/' + rec._id, '/annotations', '/annotations', jar, log)
            ]);
          })
        );
      }).then(function () {
        // Fetch evetns
        log('events', 'Fetching events');
        return req({
          url: '/api/events/raw?raw=raw',
          baseUrl: SERVER_PATH,
          jar: jar
        }).then(function (res) {
          var events = JSON.parse(res[1]);
          return Q.all(
            events.map(function (ev) {
              return Q.all([
                fetchAndSave('/api/events/' + ev._id, '', '/index.json', jar, log),
                fetchAndSave('/api/events/' + ev._id, '/annotations', '/annotations', jar, log)
              ]);
            })
          );
        });
      }).then(function () {
        return fs.readFileSync(logsPath, 'utf8');
      });
    },
    function onError (err) {
      console.error(err);
      log('err', 'Error: ' + err);
      throw err;
    }
  );

};

function fetchAndSave (path, address, file, jar, log) {
  return mkdirp(WRITE_PATH + path).then(function () {
    var promise = Q.defer();
    var writeStream = fs.createWriteStream(WRITE_PATH + path + file);
    request.get(SERVER_PATH + path + address, {
      jar: jar
    }).on('end', function () {
      log('file', 'Wrote file: ' + path + file);
      writeStream.close();
      promise.resolve();
    }).pipe(writeStream).on('error', function (err) {
      promise.reject(err);
    });
    return promise.promise;
  });
}
