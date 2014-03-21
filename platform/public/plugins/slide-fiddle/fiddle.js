define(['module', '_', 'slider/slider.plugins', 'ace', './fiddleOutput'], function(module, _, sliderPlugins, ace) {
    'use strict';

    var EDITOR_THEME = 'todr';
    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('slide', 'fiddle', 'slide-fiddle', 5000).directive('slideFiddle', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    fiddle: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/fiddle.html',
                link: function(scope, element) {
                    element.find('.editor').each(function() {
                        var e = this;
                        var editor = ace.edit(e);
                        editor.setTheme("ace/theme/" + EDITOR_THEME);
                        editor.getSession().setMode("ace/mode/" + e.getAttribute('data-mode'));
                        var content = e.getAttribute('data-content');

                        var updateScopeLater = _.debounce(function() {
                            scope.$apply(function() {
                                scope.fiddle[content] = editor.getValue();
                            });
                        }, 50);
                        scope.$watch('fiddle.' + content, function() {
                            if (editor.getValue() !== scope.fiddle[content]) {
                                editor.setValue(scope.fiddle[content]);
                                editor.clearSelection();
                            }
                        });
                        editor.on('change', function() {
                            var newValue = editor.getValue();
                            if (scope.fiddle[content] !== newValue) {
                                updateScopeLater();
                            }
                            //Trigger event
                            sliderPlugins.trigger('slide.slide-fiddle.change', scope.fiddle);
                        });
                        sliderPlugins.onLoad(function() {
                            sliderPlugins.trigger('slide.slide-fiddle.change', scope.fiddle);
                        });
                    });
                }
            };
        }
    ]);

});