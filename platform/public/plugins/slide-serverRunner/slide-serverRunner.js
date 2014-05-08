define(['module', '_', 'slider/slider.plugins'], function(module, _, sliderPlugins) {
    'use strict';

    var EXECUTION_DELAY = 300;

    var path = sliderPlugins.extractPath(module);    

    sliderPlugins.registerPlugin('slide', 'serverRunner', 'slide-server-runner', 5000).directive('slideServerRunner', [
        'Sockets',
        function(Sockets) {
            return {
                restrict: 'E',
                scope: {
                    language: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-serverRunner.html',
                link: function(scope, element) {
                    sliderPlugins.listen(scope, 'slide.slide-code.change', _.debounce(function(ev, codeEditor) {

                        var code = codeEditor.getValue();
                        var errors = code;//evalCode(code);

                        Sockets.emit('serverRunner.code.run', {
                            language: scope.language,
                            code: code
                        });

                        element.find('.errors').html(errors);

                    }, EXECUTION_DELAY));
                }
            };
        }
    ]);

});
