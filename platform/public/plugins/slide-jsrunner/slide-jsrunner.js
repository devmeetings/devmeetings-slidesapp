define(['module', '_', 'slider/slider.plugins', './jsrunner-coffee'], function(module, _, sliderPlugins, coffeeRunner) {
    'use strict';

    var EXECUTION_DELAY = 300;

    var path = sliderPlugins.extractPath(module);

    var evalJsCode = function(value) {

        var triggerFunctionName = '________trigger';
        // We have to process code through the plugins
        var toObserve = sliderPlugins.getPlugins('slide.slide-jsrunner', 'process').map(function(plugin) {
            return plugin.plugin;
        });

        // Now convert to some code that will be injected
        toObserve = toObserve.map(function(plugin) {
            var monitor = _.isArray(plugin.monitor) ? plugin.monitor : [plugin.monitor];

            var invoke = triggerFunctionName + '("' + plugin.name + '", ' + monitor.join(', ') + ')';
            return 'try { ' + invoke + ' } catch (e) { if (typeof __debug !== "undefined") { console.warn(e); } }';
        });

        // Actually execute code
        try {
            var trigger = function(name /*, args */ ) {
                var args = [].slice.call(arguments, 1);
                sliderPlugins.trigger.apply(sliderPlugins, ['slide.slide-jsrunner.' + name].concat(args));
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


    var compilers = {
        'coffee': coffeeRunner
    };

    sliderPlugins.registerPlugin('slide', 'jsrunner', 'slide-jsrunner', 5000).directive('slideJsrunner', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    jsrunner: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-jsrunner.html',
                link: function(scope, element) {
                    var setErrors = function(errors) {
                        element.find('.errors').html(errors);
                    };

                    sliderPlugins.listen(scope, 'slide.slide-code.change', _.debounce(function(ev, codeEditor) {

                        var code = codeEditor.getValue();

                        if (compilers[scope.jsrunner]) {
                            try {
                                code = compilers[scope.jsrunner].compileToJs(code);
                            } catch (e) {
                                setErrors("Compilation error: " + e);
                            }
                        }

                        var errors = evalJsCode(code);
                        setErrors(errors);

                    }, EXECUTION_DELAY));
                }
            };
        }
    ]);

});