var log = function(socket, pluginName) {
    return function() {
        var args = [].slice.call(arguments);
        args.unshift("[" + socket.id + "][" + pluginName + "] ");
        console.log.apply(console, args);
    };
};

var ctrl = function(ctrlName) {
    return require('../app/controllers/' + ctrlName);
};

var passportSocketIo = require('passport.socketio');

var plugins = require('./plugins');
var pluginsEvents = require('../app/plugins/events');

module.exports = function(io, sessionConfig) {
    io.serveClient(false);

    plugins.invokePlugins('initSockets', [io]);

    io.use(passportSocketIo.authorize({
        cookieParser: sessionConfig.cookieParser,
        key: sessionConfig.key, // the name of the cookie where express/connect stores its session_id
        secret: sessionConfig.secret, // the session_secret to parse the cookie
        store: sessionConfig.store, // we NEED to use a sessionstore. no memorystore please
    }));

    io.on('connection', function(socket) {
        var l = log(socket, 'main');

        // Join deck room
        var deck = socket.handshake.query.deck;

        if (!deck) {
            l('Disconecting because no deck');
            socket.disconnect();
            return;
        }

        socket.clientData = {
            id: socket.id,
            user: socket.request.user
        };
        pluginsEvents.emit('room.joined', deck);

        // Disconnection
        socket.on('disconnect', function() {
            var data = socket.clientData;
            socket.leave(data.deck);
            pluginsEvents.emit('room.left', data.deck);
        });

        // Plugins
        plugins.invokePlugins('onSocket', function(plugin) {
            return [log(socket, plugin.name), socket, io];
        });
    });
};
