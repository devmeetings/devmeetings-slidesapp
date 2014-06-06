define(['module', '_', 'slider/slider.plugins', 'ace'], function(module, _, sliderPlugins, ace) {
    'use strict';

    var OUTPUT_THEME = 'twilight';

    sliderPlugins.registerPlugin('slide', 'monitor', 'slide-jsonoutput', 6000).directive('slideJsonoutput', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    monitor: '=data',
                    slide: '=context'
                },
                template: '<div><div class="editor editor-output"></div></div>',
                link: function(scope, element) {
                    var outputAce = ace.edit(element.find('.editor')[0]);
                    outputAce.setTheme("ace/theme/" + OUTPUT_THEME);
                    outputAce.getSession().setMode("ace/mode/json");
                    outputAce.setReadOnly(true);
                    outputAce.setHighlightActiveLine(false);
                    outputAce.setShowPrintMargin(false);
                    outputAce.renderer.setShowGutter(false);


                    sliderPlugins.registerScopePlugin(scope, 'slide.slide-jsrunner', 'process', {
                        monitor: scope.monitor,
                        name: 'jsonoutput'
                    });

                    var outputJson = function(output) {
                        var res = JSON.stringify(output, null, 2);
                        outputAce.setValue(res);
                        outputAce.clearSelection();
                    };

                    sliderPlugins.listen(scope, 'slide.slide-jsrunner.jsonoutput', outputJson);
                    sliderPlugins.listen(scope, 'slide.jsonOutput.display', outputJson);

                }
            };
        }
    ]);

});