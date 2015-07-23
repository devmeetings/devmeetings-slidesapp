/* globals define */
define(['_'], function (_) {
  var plugins = {};

  var newPlugin = function (order, trigger, plugin, data) {
    return {
      order: order,
      trigger: trigger,
      plugin: plugin,
      data: data
    };
  };

  return {
    registerPlugin: function (namespace, trigger, plugin, data) {
      plugins[namespace] = plugins[namespace] || [];
      data = data || {};
      data.order = data.order || 999999;

      plugins[namespace].push(newPlugin(data.order, trigger, plugin, data));

      return this;
    },

    unregisterPlugin: function (namespace, trigger, plugin) {
      var pluginSpace = plugins[namespace];
      var p = pluginSpace.filter(function (p) {
        return p.plugin === plugin && p.trigger === trigger;
      });
      pluginSpace.splice(pluginSpace.indexOf(p), 1);
    },

    registerScopePlugin: function (scope, namespace, trigger, plugin, order) {
      var self = this;
      scope.$on('$destroy', function () {
        self.unregisterPlugin(namespace, trigger, plugin);
      });
      return this.registerPlugin(namespace, trigger, plugin, order);
    },

    getAllPlugins: function () {
      return _.clone(plugins, true);
    },

    getPlugins: function (namespace, trigger) {
      var filter = _.constant(true);
      if (trigger !== undefined) {
        filter = function (plugin) {
          return plugin.trigger === trigger;
        };
      }

      if (plugins[namespace]) {
        return plugins[namespace].filter(filter).sort(function (a, b) {
          return a.order - b.order;
        });
      }
      return [];
    }

  };
});
