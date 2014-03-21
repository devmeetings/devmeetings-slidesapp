define(['_'], function(_) {
    var plugins = {};

    return {
        registerPlugin: function(namespace, trigger, plugin, order) {
            plugins[namespace] = plugins[namespace] || [];
            order = order || 999999;

            plugins[namespace].push({
                order: order,
                trigger: trigger,
                plugin: plugin
            });

            return this;
        },
        getPlugins: function(namespace, trigger) {
            var filter = _.constant(true);
            if (trigger !== undefined) {
                filter = function(plugin) {
                    return plugin.trigger === trigger;
                };
            }

            if (plugins[namespace]) {
                return plugins[namespace].filter(filter).sort(function(a, b) {
                    return a.order > b.order;
                });
            }
            return [];
        }
    };
});