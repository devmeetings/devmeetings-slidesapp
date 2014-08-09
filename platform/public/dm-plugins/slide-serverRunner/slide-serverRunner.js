define(['module', '_', 'slider/slider.plugins'], function(module, _, sliderPlugins) {
    'use strict';

    var EXECUTION_DELAY = 300;

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('slide', 'serverRunner', 'slide-server-runner', 4000).directive('slideServerRunner', [
        'Sockets',
        function(Sockets) {

            var updateScope = function(data) {};
            Sockets.on('serverRunner.code.result', function(data) {
                updateScope(data);
            });


            return {
                restrict: 'E',
                scope: {
                    runner: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-serverRunner.html',
                link: function(scope, element) {
                    updateScope = function(data) {
                        scope.$apply(function() {
                            scope.success = data.success;
                            scope.errors = data.errors || "";
                            scope.stacktrace = data.stacktrace;
                        });

                        if (data.success) {
                            sliderPlugins.trigger('slide.jsonOutput.display', data.result);
                        } else {
                            sliderPlugins.trigger('slide.jsonOutput.display', data.errors);
                        }
                    };

                    sliderPlugins.listen(scope, 'slide.slide-code.change', _.debounce(function(ev, codeEditor) {

                        var code = codeEditor.getValue();

                        sliderPlugins.trigger('slide.serverRunner.code.run');
                        Sockets.emit('serverRunner.code.run', {
                            runner: scope.runner,
                            code: code
                        });

                    }, EXECUTION_DELAY));
                }
            };
        }
    ]);

});