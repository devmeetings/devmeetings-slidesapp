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
        return plugin;
    });
});


var CollectionPromise = function(collectionPromise) {
    this.collectionPromise = collectionPromise;
};
CollectionPromise.prototype = {
    filter: function(filter, ctx) {
        return new CollectionPromise(this.collectionPromise.then(function(list) {
            return list.filter(filter, ctx);
        }));
    },
    forEach: function(cb, ctx) {
        return new CollectionPromise(this.collectionPromise.then(function(list) {
            list.forEach(cb, ctx);
            return list;
        }));
    },
    map: function(cb, ctx) {
        return new CollectionPromise(this.collectionPromise.then(function(list) {
            list.map(cb, ctx);
            return list;
        }));
    },
};

var pluginsCollection = new CollectionPromise(plugins);


module.exports = pluginsCollection;
module.exports.all = plugins;