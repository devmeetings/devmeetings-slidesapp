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

                    scope.microtasks.filter(function(task) {
                        return task.js_assert;
                    }).map(function(task) {
                        sliderPlugins.registerScopePlugin(scope, 'slide.slide-jsrunner', 'process', {
                            monitor: task.monitor,
                            name: task.id
                        });

                        sliderPlugins.listen(scope, 'slide.slide-jsrunner.' + task.id, function(x) {
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
