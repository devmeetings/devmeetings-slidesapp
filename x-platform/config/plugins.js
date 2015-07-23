var fs = require('promised-io/fs');
var _ = require('lodash');
var logger = require('./logging');
var pluginsPath = 'app/plugins/';

var plugins = fs.readdir(pluginsPath).then(function (files) {
  return files.filter(function (pluginName) {
    return fs.statSync(pluginsPath + pluginName).isDirectory();
  }).map(function (pluginName) {
    try {
      var mod = require('../' + pluginsPath + pluginName + '/' + pluginName);
      mod.name = pluginName;
      return mod;
    } catch (e) {
      logger.error(e);
      throw new Error('Cannot load plugin ' + pluginName);
    }
  }).filter(function (plugin) {
    return plugin;
  });
});

var CollectionPromise = function (collectionPromise) {
  this.collectionPromise = collectionPromise;
};
CollectionPromise.prototype = {
  filter: function (filter, ctx) {
    return new CollectionPromise(this.collectionPromise.then(function (list) {
      return list.filter(filter, ctx);
    }));
  },
  forEach: function (cb, ctx) {
    return new CollectionPromise(this.collectionPromise.then(function (list) {
      list.forEach(cb, ctx);
      return list;
    }));
  },
  map: function (cb, ctx) {
    return new CollectionPromise(this.collectionPromise.then(function (list) {
      list.map(cb, ctx);
      return list;
    }));
  },
  invokePlugins: function (functionName, args) {
    var invokingFunc = function (plugin) {
      plugin[functionName].apply(plugin, _.isFunction(args) ? args(plugin) : args);
    };
    this.filter(function (plugin) {
      return plugin[functionName];
    }).forEach(invokingFunc);
  }
};

module.exports = new CollectionPromise(plugins);
module.exports.all = plugins;
