define(['module', '_', 'slider/slider.plugins', 'ace'], function(module, _, sliderPlugins, ace) {
    'use strict';

    var EDITOR_THEME = 'twilight';
    var EXECUTION_DELAY = 500;

    var path = sliderPlugins.extractPath(module);

    var evalCode = function(monitor, value) {
        if (monitor) {
            value += "\n\n;return " + monitor + ";";
        }
        try {
            var result = eval("(function(){ \"use strict\"; " + value + "}())");
            // TODO: microtasks?
            // TODO: async?
            var json = JSON.stringify(result, null, 2);

            return {
                output: json,
                errors: ''
            };
        } catch (e) {
            return {
                output: null,
                errors: e
            };
        }
    };

    sliderPlugins.registerPlugin('slide', 'monitor', 'slide-jsrunner', 5000).directive('slideJsrunner', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    monitor: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-jsrunner.html',
                link: function(scope, element) {
                    var output = ace.edit(element.find('.editor')[0]);
                    output.setTheme("ace/theme/" + EDITOR_THEME);
                    output.getSession().setMode('ace/mode/json');
                    output.setReadOnly(true);
                    output.setHighlightActiveLine(false);
                    output.setShowPrintMargin(false);
                    output.renderer.setShowGutter(false);

                    sliderPlugins.on('slide.slide-code.change', _.debounce(function(ev, codeEditor) {

                        var code = codeEditor.getValue();
                        var result = evalCode(scope.monitor, code);


                        if (result.output) {
                            output.setValue(result.output);
                            output.clearSelection();
                        }
                        // TODO errors
                        element.find('.errors').html(result.errors);

                    }, EXECUTION_DELAY));
                }
            };
        }
    ]);

});