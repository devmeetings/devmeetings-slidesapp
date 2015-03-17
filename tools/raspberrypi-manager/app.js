var express = require('express');
var app = express(),
  Q = require('q'),
  bodyParser = require('body-parser');

var IFACE = 'wlan1';


var wifi = require('./wifi');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req, res) {

  var wifiData = wifi.readWifi();

  wifiData.done(function(data) {

    res.render('index', {
      wifi: data
    });

  }, onError(res));

});

app.get('/logs', function(req, res) {
  function log(path) {
    return execCommand('tail -n 100 ' + path).fail(function(err) {
      return 'File Not Found. ' + err;
    });
  }
  var mongo = log('/var/log/mongodb/mongod.log');
  var xpla = log('/srv/.forever/xplatform.log');
  var nginx = log('/var/log/nginx/error.log');

  Q.all([mongo, xpla, nginx]).done(function(logs) {

    res.render('logs', {
      mongo: logs[0],
      xpla: logs[1],
      nginx: logs[2]
    });

  }, onError(res));
});

app.get('/status', function(req, res) {
  function status(service) {
    return execCommand('service ' + service + ' status').fail(function(err) {
      return 'Err: ' + err;
    });
  }

  function pidof(service) {
    return execCommand('pidof ' + service);
  }

  Q.all([
    status('mongod'),
    status('nginx'),
    status('hostapd'),
    pidof('udhcpd'),
    execCommand('su xplatform -c "forever list"').fail(function(err) {
      return 'Cannot get status: ' + err;
    })
  ]).spread(function(mongo, nginx, hostapd, udhcpd) {
    res.render('status', {
      mongo: mongo,
      nginx: nginx,
      hostapd: hostapd,
      udhcpd: udhcpd
    });
  }).done(onError(res));

});

app.post('/', function(req, res) {

  var scan = execCommand('iwlist ' + IFACE + ' scan | grep -ie "ssid" | sed s/^\\\\s\\\\+//g');
  var wifiData = wifi.readWifi();

  Q.all([scan, wifiData]).done(function(data) {
    res.render('index', {
      wifi: data[1],
      networks: data[0]
    });
  }, onError(res));

});

app.post('/wifi', function(req, res) {

  var ssid = req.body.ssid;
  var psk = req.body.psk;

  wifi.writeWifi(ssid, psk)
    .then(function() {
      return execCommand('ifdown ' + IFACE + ' && ifup ' + IFACE);
    })
    .done(function() {
      res.redirect('/');
    }, onError(res));

});

app.post('/reboot', function(req, res) {

  execCommand('reboot', function() {
    res.send(200);
  }, onError(res));

});

app.post('/halt', function(req, res) {

  execCommand('halt', function() {
    res.send(200);
  }, onError(res));

});


app.use(express.static('public'));

app.listen(9911, "localhost");


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

function onError(res) {
  return function(err) {
    res.status(500).send(err);
  };
}
