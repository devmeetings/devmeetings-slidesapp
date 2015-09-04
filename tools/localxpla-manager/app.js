var express = require('express');
var Q = require('q');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var NginxParser = require('nginxparser');

var populateCache = require('./populate');

var app = express();

var LOGS_PATH = '/var/log/nginx/access.log';
var POPULATE_LOGS_PATH = path.join(__dirname, './public/populate.log');
var LAST_REFRESH_DATE = path.join(__dirname, './public/refresh.log');

app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {
  res.render('index', {});
});

app.get('/isLocal', function (req, res) {
  res.send(true);
});

app.get('/local/api/populate', function (req, res) {
  fs.createReadStream(LAST_REFRESH_DATE, 'utf8').pipe(res);
});

app.post('/local/api/populate', function (req, res, next) {
  populateCache(POPULATE_LOGS_PATH).done(function (done) {
    fs.writeFileSync(LAST_REFRESH_DATE, new Date());
    res.send(done.split('\n').join('<br>'));
  });
});

app.get('/local/api/logs/populate', function (req, res) {
  execCommand('cat ' + POPULATE_LOGS_PATH).done(function (lines) {
    res.send(lines.split('\n').join('<br>'));
  });
});

app.get('/local/api/logs/raw', function (req, res) {
  execCommand('tail -n 100 ' + LOGS_PATH).done(function (lines) {
    res.send(lines);
  });
});

app.get('/local/api/logs', function (req, res) {
  var parser = new NginxParser('$remote_addr - $remote_user [$time_local] ' +
                                '"$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"');

  var total = {};
  parser.read(LOGS_PATH, function (row) {
    total[row.request] = total[row.request] || {
      request: row.request,
      count: 0,
      lastStatus: 0,
      timestamp: null
    };
    var data = total[row.request];
    data.count++;
    data.lastStatus = row.status;
    data.timestamp = row.timestamp;
  })
  .on('end', function () {
    res.send(_.values(total));
  })
  .on('error', function (err) {
    console.error(err);
    res.sendStatus(400);
  });

});


app.use('/public', express.static('public'));

app.listen(process.env.PORT || 9922, 'localhost');


var exec = require('child_process').exec;

function execCommand(cmd) {
  var defer = Q.defer();
  exec(cmd, function(err, stdout, stderr) {
    if (err) {
      defer.reject(stderr);
    } else {
      defer.resolve(stdout);
    }
  });
  return defer.promise;
}
