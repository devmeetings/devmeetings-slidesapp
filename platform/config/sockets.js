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

var plugins = require('./plugins');
var pluginsEvents = require('../app/plugins/events');

module.exports = function(io) {
    io.on('connection', function(socket) {
        var l = log(socket, "main");
        l("New client connected");

        // Join deck room
        var deck = socket.manager.handshaken[socket.id].query.deck;

        if (!deck) {
            l("Connected without deck query.");
            socket.disconnect();
            return;
        }
        socket.set('deck.current', deck);
        socket.join(deck);
        pluginsEvents.emit('room.joined', deck);

        plugins.filter(function(plugin) {
            return plugin.socketInit;
        }).forEach(function(plugin) {
            plugin.socketInit(log(socket, plugin.name), socket, io);
        });
    });
};