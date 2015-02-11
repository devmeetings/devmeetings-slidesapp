var express = require('express'),
  mongoose = require('mongoose'),
  http = require('http'),
  socketio = require('socket.io'),
  config = require('./config/config');


mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function() {
  throw new Error('unable to connect to database at ' + config.db);
});

var plugins = require('./config/plugins');
plugins.invokePlugins('init', [config]);

var app = express();

var sessionConfig = require('./config/express')(app, config);

require('./config/mail')(app);
require('./config/routes')(app);
require('./config/passport');

var server = http.Server(app);

if (config.meteorProxy) {
  var proxy = require('http-proxy').createProxyServer({
    target: config.meteorProxy
  });
  console.log("Configuring proxy.");
  server.on('upgrade', function(req) {
    if (req.url.indexOf('/live') === 0) {
      return proxy.ws.apply(proxy, arguments);
    }
  });
  app.all('/live/*', proxy.web.bind(proxy));
}
// Configure socketio after proxy
var io = socketio.listen(server);
io.set('destroy upgrade', false);
require('./config/sockets')(io, sessionConfig);

console.log('Server listening on port:', config.port);
server.listen(config.port);
