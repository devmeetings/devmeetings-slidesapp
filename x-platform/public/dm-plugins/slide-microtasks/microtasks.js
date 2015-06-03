define([
    'module', '_', 'slider/slider.plugins', 'dm-xplatform/directives/dm-taskicon/dm-taskicon',
    './microtask_js_assert', './microtask_regexp', './microtask_output', './microtask_fiddle'
], function(
    module, _, sliderPlugins, jsAssert, microtaskRegexp, output, fiddleOutput) {
    'use strict';

    var path = sliderPlugins.extractPath(module);

    /* jshint ignore:start */
    var hashCode = function(str) {
        var hash = 0;
        if (!str || str.length === 0) return hash;
        var i = 0;
        for (; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    };
    /* jshint ignore:end */
    sliderPlugins.registerPlugin('slide', 'microtasks', 'slide-jsmicrotasks', 8).directive('slideJsmicrotasks', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    microtasks: '=data',
                    slide: '=context',
                    path: '@'
                },
                templateUrl: path + '/microtasks.html',
                link: function(scope, element) {

                    scope.taskMeta = {};

                    scope.$watchCollection('microtasks', function(microtasks) {
                        _.forEach(scope.microtasks, function(task) {
                            if (scope.taskMeta[task.description]) {
                                return;
                            }

                            var meta = {
                                completed: false,
                                taskName: task.taskName
                            };
                            scope.taskMeta[task.description] = meta;

                            var keys = _.keys(task);
                            _.forEach(keys, function(key) {
                                var plugin = _.find(sliderPlugins.getPlugins('microtask.runner', key), function(plugin) {
                                    return plugin.plugin;
                                });
                                if (!plugin) {
                                    return;
                                }

                                meta.hash = hashCode(task[key]).toString();

                                plugin.plugin({
                                    task: task,
                                    hash: meta.hash
                                }, sliderPlugins.registerScopePlugin.bind(sliderPlugins, scope), sliderPlugins.listen.bind(sliderPlugins, scope), function() {
                                    scope.$apply(function() {
                                        meta.completed = true;
                                    });
                                });

                            });
                        });
                    });
                }
            };
        }
    ]);

});
