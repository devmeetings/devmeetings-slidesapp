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

    plugins.invokePlugins('initSockets', [io]);

    io.set('authorization', passportSocketIo.authorize({
        cookieParser: sessionConfig.cookieParser,
        key: 'connect.sid', // the name of the cookie where express/connect stores its session_id
        secret: sessionConfig.secret, // the session_secret to parse the cookie
        store: sessionConfig.store, // we NEED to use a sessionstore. no memorystore please
    }));

    io.on('connection', function(socket) {
        var l = log(socket, "main");
        l("New client connected: " + socket.handshake.user.name);

        // Join deck room
        var deck = socket.manager.handshaken[socket.id].query.deck;

        if (!deck) {
            l("Connected without deck query.");
            socket.disconnect();
            return;
        }

        socket.set('clientData', {
            deck: deck,
            user: socket.handshake.user
        });
        socket.join(deck);
        pluginsEvents.emit('room.joined', deck);

        // Disconnection
        socket.on('disconnect', function() {
            l("Client disconnected");

            socket.get('clientData', function(err, data) {
                pluginsEvents.emit('romm.left', data.deck);
            });
        });

        // Plugins
        plugins.invokePlugins('onSocket', function(plugin) {
            return [log(socket, plugin.name), socket, io];
        });
    });
};