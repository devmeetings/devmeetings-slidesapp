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


var fs = require('promised-io/fs');
var pluginsPath = 'app/plugins/';

var plugins = fs.readdir(pluginsPath).then(function(files) {
    return files.map(function(pluginName) {
        try {
            var mod = require("../" + pluginsPath + pluginName + "/" + pluginName);
            mod.name = pluginName;
            return mod;
        } catch (e) {
            console.warn("Cannot load plugin " + pluginName, e);
            return null;
        }
    }).filter(function(plugin) {
        return plugin && plugin.socketInit;
    });
});

module.exports = function(io) {
    io.on('connection', function(socket) {
        var l = log(socket, "main");
        l("New client connected");

        socket.on('deck.current', function(id) {
            socket.set('deck.current', id);
            socket.join(id);
        });

        plugins.then(function(pluginsList) {

            pluginsList.forEach(function(plugin) {

                plugin.socketInit(log(socket, plugin.name), socket, io);

            });
        });
    });
};