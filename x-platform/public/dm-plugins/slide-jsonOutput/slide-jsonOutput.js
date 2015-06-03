define(['module', '_', 'slider/slider.plugins', 'ace'], function(module, _, sliderPlugins, ace) {
    'use strict';

    var OUTPUT_THEME = 'twilight';

    sliderPlugins.registerPlugin('slide', 'monitor', 'slide-jsonoutput', 6000).directive('slideJsonoutput', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    // monitor: '=data',
                },
                template: '<div><div class="editor editor-output"></div></div>',
                link: function(scope, element) {
                    var outputAce = ace.edit(element.find('.editor')[0]);
                    outputAce.$blockScrolling = Infinity;
                    outputAce.setTheme('ace/theme/' + OUTPUT_THEME);
                    outputAce.getSession().setMode('ace/mode/json');
                    outputAce.setReadOnly(true);
                    outputAce.setHighlightActiveLine(false);
                    outputAce.setShowPrintMargin(false);
                    outputAce.renderer.setShowGutter(false);

                    sliderPlugins.listen(scope, 'slide.jsonOutput.display', function(output, what) {
                        var res = JSON.stringify(output, null, 2);
                        if (what) {
                            res = what + ':\n' + res;
                        }
                        outputAce.setValue(res);
                        outputAce.clearSelection();
                    });

                }
            };
        }
    ]);


    sliderPlugins.registerPlugin('slide', 'monitor', 'slide-jsrunner-jsonoutput').directive('slideJsrunnerJsonoutput', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    monitor: '=data',
                    // slide: '=context'
                },
                link: function(scope) {

                    sliderPlugins.registerScopePlugin(scope, 'slide.slide-jsrunner', 'process', {
                        monitor: scope.monitor,
                        name: 'jsonoutput'
                    });

                    sliderPlugins.listen(scope, 'slide.slide-jsrunner.jsonoutput', function(elem) {
                        sliderPlugins.trigger('slide.jsonOutput.display', elem, scope.monitor);
                    });
                }

            };
        }
    ]);

});
