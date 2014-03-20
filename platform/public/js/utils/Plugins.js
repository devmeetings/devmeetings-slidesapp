define([], function() {
    var plugins = {};

    return {
        registerPlugin: function(namespace, trigger, directiveName, order) {
            plugins[namespace] = plugins[namespace] || [];
            order = order || 999999;

            plugins[namespace].push({
                order: order,
                trigger: trigger,
                name: directiveName
            });

            return this;
        },
        getPlugins: function(namespace) {
            if (plugins[namespace]) {
                return plugins[namespace].sort(function(a, b) {
                    return a.order > b.order;
                });
            }
            return [];
        }
    };
});