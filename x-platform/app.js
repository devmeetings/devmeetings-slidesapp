var express = require('express'),
  mongoose = require('mongoose'),
  http2 = require('spdy'),
  fs = require('fs'),
  socketio = require('socket.io'),
  config = require('./config/config'),
  logger = require('./config/logging');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function() {
  throw new Error('unable to connect to database at ' + config.db);
});

var plugins = require('./config/plugins');
plugins.invokePlugins('init', [config]);

var app = express();
var proxy;
if (config.meteorProxy) {
  proxy = require('http-proxy').createProxyServer({
    target: config.meteorProxy
  });
  logger.info('Configuring proxy.');
  app.all('/live/*', proxy.web.bind(proxy));
}

var router = express.Router();
var sessionConfig = require('./config/express')(app, config, router);

require('./config/mail')(app);
require('./config/routes')(router);
require('./config/passport');

var server = http2.createServer({
  key: fs.readFileSync('./config/certs/server.key'),
  cert: fs.readFileSync('./config/certs/server.crt')
}, app);

if (config.meteorProxy) {
  server.on('upgrade', function(req) {
    if (req.url.indexOf('/live') === 0) {
      return proxy.ws.apply(proxy, arguments);
    }
  });
}

// Configure socketio after proxy
var io = socketio(server);
require('./config/sockets')(io, sessionConfig);

// Configure blocked
require('./config/blocked')(function(ms) {

  logger.warn('Blocked for ' + ms + 'ms', {
    blockedFor: ms
  });

});

server.listen(config.port, function() {
  logger.info('Server listening on port:', config.port, ' with env: ' + config.name);
});

if (config.isDev) {
  var unsafePort = config.port + 1000;
  var server = require('http').createServer(app);
  var io = socketio(server);
  require('./config/sockets')(io, sessionConfig, true);
  server.listen(unsafePort, function() {
    logger.info('UNSAFE DEVELOPMENT! Version listening on port:', unsafePort);
  });
}
