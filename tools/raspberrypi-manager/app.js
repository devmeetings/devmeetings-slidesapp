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

  });

});

app.post('/', function(req, res) {

  var scan = execCommand('iwlist ' + IFACE + ' scan | grep -ie "ssid" | sed s/^\\\\s\\\\+//g');
  var wifiData = wifi.readWifi();

  Q.all([scan, wifiData]).done(function(data) {
    res.render('index', {
      wifi: data[1],
      networks: data[0]
    });
  });

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
    });

});

app.post('/reboot', function(req, res) {

  execCommand('reboot', function() {
    res.send(200);
  });
});

app.use(express.static('public'));

app.listen(9911);


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
