define(['module', '_', 'slider/slider.plugins'], function(module, _, sliderPlugins, ace) {
    'use strict';

    var path = sliderPlugins.extractPath(module);

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


                    scope.microtasks.filter(function(task) {
                        return task.js_assert;
                    }).map(function(task) {
                        var taskHash = hashCode(task.js_assert).toString();
                        sliderPlugins.registerScopePlugin(scope, 'slide.slide-jsrunner', 'process', {
                            monitor: task.monitor,
                            name: taskHash
                        });

                        sliderPlugins.listen(scope, 'slide.slide-jsrunner.' + taskHash, function(x) {
                            if (task.completed) {
                                return;
                            }

                            var toEval = [
                                '(function(' + task.monitor + '){',
                                task.js_assert,
                                '}(x))'
                            ].join(';\n');

                            /* jshint evil:true */
                            var result = eval(toEval);
                            /* jshint evil:false */

                            if (result) {
                                scope.$apply(function() {
                                    task.completed = true;
                                });
                            }
                        });
                    });
                }
            };
        }
    ]);

});
