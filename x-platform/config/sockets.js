var logger = require('./logging');

var log = function (socket, pluginName) {
  function appendSocketData (args2) {
    var args = [].slice.call(args2);
    args.unshift('[' + socket.id + '][' + pluginName + '] ');
    return args;
  }

  var logx = function (/*args*/) {
    var args = appendSocketData(arguments);
    logger.info.apply(logger, args);
  };

  logx.error = function ( /*args*/) {
    var args = appendSocketData(arguments);
    logger.error.apply(logger, args);
  };

  return logx;
};

var passportSocketIo = require('passport.socketio');
var plugins = require('./plugins');
var pluginsEvents = require('../app/plugins/events');
var storeConfig = require('./store');
var store = require('../app/services/store');

module.exports = function (io, sessionConfig, skipPluginEventsListeners) {
  'use strict';

  io.serveClient(false);

  io.adapter(storeConfig.getSocketsAdapter());

  io.use(passportSocketIo.authorize({
    cookieParser: sessionConfig.cookieParser,
    key: sessionConfig.key, // the name of the cookie where express/connect stores its session_id
    secret: sessionConfig.secret, // the session_secret to parse the cookie
    store: sessionConfig.store // we NEED to use a sessionstore. no memorystore please
  }));

  plugins.invokePlugins('initSockets', [io]);

  if (!skipPluginEventsListeners) {
    pluginsEvents.on('rejoin', function (socket, msg) {
      socket.emit('rejoin', msg);
    });
  }

  io.on('connection', function (socket) {
    var l = log(socket, 'main');

    // Join deck room
    var deck = socket.handshake.query.deck;

    if (!deck) {
      l('Disconecting because no deck');
      socket.disconnect();
      return;
    }

    store.set('socketClientData_' + socket.id, {
      id: socket.id,
      user: socket.request.user
    });

    pluginsEvents.emit('room.joined', deck);

    // Disconnection
    socket.on('disconnect', function () {
      store.get('socketClientData_' + socket.id).done(function (data) {
        store.del('socketClientData_' + socket.id);
        pluginsEvents.emit('room.left', data.deck);
      });
    });

    // Plugins
    plugins.invokePlugins('onSocket', function (plugin) {
      return [log(socket, plugin.name), socket, io];
    });
  });
};
