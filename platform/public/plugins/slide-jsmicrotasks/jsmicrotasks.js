define(['module', '_', 'slider/slider.plugins', './microtask_js_assert'], function(module, _, sliderPlugins, ace, js_assert) {
    'use strict';

    var path = sliderPlugins.extractPath(module);


    var hashCode = function (str) {
        var hash = 0;
        if (str.length === 0) return hash;
        var i = 0;
        for (; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    };

    sliderPlugins.registerPlugin('slide', 'microtasks', 'slide-jsmicrotasks', 500).directive('slideJsmicrotasks', [
 
        function() {
            return {
                restrict: 'E',
                scope: {
                    microtasks: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/jsmicrotasks.html',
                link: function(scope, element) {

                    
                    _.forEach(scope.microtasks, function (task) {
                        var keys = _.keys(task);
                        _.forEach(keys, function (key) {
                            var plugin = _.find(sliderPlugins.getPlugins('microtasks', key), function (plugin) {
                                return plugin.plugin;
                            });
                            if (plugin) {
                                task.hash = hashCode(task[key]).toString(); 
                                plugin.plugin(task, sliderPlugins.registerScopePlugin.bind(sliderPlugins, scope), sliderPlugins.listen.bind(sliderPlugins, scope), function (){
                                    scope.$apply(function () {
                                        task.completed = true;
                                    });
                                });
                                return;
                            }
                        });
                    });
                }
            };
        }
    ]);

});
