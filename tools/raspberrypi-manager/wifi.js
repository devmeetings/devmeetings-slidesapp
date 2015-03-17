var Q = require('q'),
  fs = require('fs');

var file = '/etc/wpa_supplicant/wpa_supplicant.conf';
var file = '../../deployment/ansible/roles/rasbpi/files/wpa_supplicant.conf';


var patterns = {
  ssid: /ssid="(.+)"/,
  psk: /psk="(.+)"/
};

function readFile() {
  return Q.ninvoke(fs, 'readFile', file);
}

function writeFile(content) {
  return Q.ninvoke(fs, 'writeFile', file, content);
}

function readWifi() {

  return readFile().then(function(content) {
    var c = content.toString();
    var ssid = c.match(patterns.ssid)[1];
    var psk = c.match(patterns.psk)[1];

    return {
      ssid: ssid,
      psk: psk
    };
  });

}

function writeWifi(ssid, psk) {
  ssid = ssid.replace(/"/g, '');
  psk = psk.replace('/"/g', '');

  return readFile().then(function(content) {
    var c = content.toString();
    c = c.replace(patterns.ssid, 'ssid="' + ssid + '"');
    c = c.replace(patterns.psk, 'psk="' + psk + '"');
    return writeFile(c);
  });
}



exports.readWifi = readWifi;
exports.writeWifi = writeWifi;
