var express = require('express'),
  mongoose = require('mongoose'),
  http = require('http'),
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
  var proxy = require('http-proxy').createProxyServer({
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

var server = http.Server(app);

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

logger.info('Server listening on port:', config.port);
server.listen(config.port);

// Configure blocked
require('blocked')(function(ms) {
  'use strict';

  logger.warn('Blocked for ' + ms + 'ms', {
    blockedFor: ms
  });
});
