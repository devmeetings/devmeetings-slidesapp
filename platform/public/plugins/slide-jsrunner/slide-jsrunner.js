define(['module', '_', 'slider/slider.plugins'], function(module, _, sliderPlugins) {
    'use strict';

    var EXECUTION_DELAY = 300;

    var path = sliderPlugins.extractPath(module);

    var evalCode = function(value) {

        var triggerFunctionName = '________trigger';
        // We have to process code through the plugins
        var toObserve = sliderPlugins.getPlugins('slide.slide-jsrunner', 'process').map(function(plugin) {
            return plugin.plugin;
        });

        // Now convert to some code that will be injected
        toObserve = toObserve.map(function(plugin) {
            var invoke = triggerFunctionName + '("' + plugin.name + '", ' + plugin.monitor + ')';
            return 'try { ' + invoke + ' } catch (e) { console.warn(e); }';
        });

        // Actually execute code
        try {
            var trigger = function(name, data) {
                sliderPlugins.trigger('slide.slide-jsrunner.' + name, data);
            };

            var code = ['(function(' + triggerFunctionName + '){',
                '"use strict"',
                value
            ].concat(toObserve).concat([
                '}(trigger))'
            ]).join(';\n');

            /* jshint evil:true */
            var result = eval(code);
            /* jshint evil:false */

            return null;
        } catch (e) {
            return e;
        }
    };

    sliderPlugins.registerPlugin('slide', 'jsrunner', 'slide-jsrunner', 5000).directive('slideJsrunner', [ 
        '$http',
        function($http) {
            return {
                restrict: 'E',
                scope: {
                    jsrunner: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-jsrunner.html',
                link: function(scope, element) {
                    sliderPlugins.listen(scope, 'slide.slide-code.change', _.debounce(function(ev, codeEditor) {
                        scope.getSnapshots = function () {
                            scope.snapy = $http.get('/api/codeSnapshots').then(function(result) {
                                return result.data;
                            });
                        }

                        var code = codeEditor.getValue();
                        var errors = evalCode(code);

                        $http.post('/api/codeSnapshots', {
                            codeSnapshot: {
                                slide: 'someSlideId',                                
                                code: code                                
                            }
                        });


                        element.find('.errors').html(errors);

                    }, EXECUTION_DELAY));
                }
            };
        }
    ]);

});
