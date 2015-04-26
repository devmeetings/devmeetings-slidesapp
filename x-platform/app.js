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
  var proxy2 = require('http-proxy').createProxyServer({
    target: 'http://localhost:35729/'
  });
  logger.info('Configuring proxy.');
  app.all('/live/*', proxy.web.bind(proxy));
  app.all('/livereload/*', proxy.web.bind(proxy2));
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
  var instance = process.env.NODE_APP_INSTANCE || 0;
  logger.info('Server listening on port:', config.port + instance);
});
