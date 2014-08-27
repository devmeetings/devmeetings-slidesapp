define(['module', '_', 'slider/slider.plugins', 'ace', './fiddleOutput', 'ace_languageTools'], function(module, _, sliderPlugins, ace) {
    'use strict';

    var EDITOR_THEME = 'todr';
    var path = sliderPlugins.extractPath(module);


    var handleListeners = function(scope, $window) {
        // Errors forwarder
        var listener = function(ev) {
            var d = ev.data;
            if (d.type !== 'fiddle-error') {
                return;
            }
            scope.$apply(function() {
                scope.errors = d.msg;
            });
        };

        $window.addEventListener('message', listener);
        scope.$on('$destroy', function() {
            $window.removeEventListener('message', listener);
        });
    };

    var fiddleCopy = function(scope) {
        return _.extend({
            js: '',
            css: '',
            html: '<html><head></head><body></body></html>'
        }, scope.fiddle);
    };

    var getActive = function(scope) {
        if (scope.fiddle.active) {
            return scope.fiddle.active;
        }

        var keys = _.keys(scope.fiddle);
        return _.find(['js', 'coffee', 'css', 'html', 'server'], function(key) {
            return _.contains(keys, key);
        });

    };


    var safeApply = function(fn) {
        var phase = this.$root.$$phase;

        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    sliderPlugins.registerPlugin('slide', 'fiddle', 'slide-fiddle', 3900).directive('slideFiddle', [
        '$timeout', '$window', '$rootScope',
        function($timeout, $window, $rootScope) {
            return {
                restrict: 'E',
                scope: {
                    fiddle: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/fiddle.html',
                link: function(scope, element) {
                    if (!scope.fiddle) {
                        return;
                    }

                    scope.active = getActive(scope);


                    $timeout(function() {
                        element.find('.editor').each(function() {
                            var e = this;
                            var editor = ace.edit(e);
                            var mode = e.getAttribute('data-mode');
                            editor.setTheme("ace/theme/" + EDITOR_THEME);
                            editor.setOptions({
                                enableBasicAutocompletion: true,
                                enableSnippets: true,
                                enableLiveAutocompletion: false
                            });
                            editor.getSession().setMode("ace/mode/" + mode);
                            var content = e.getAttribute('data-content');

                            var shouldTriggerEvent = false;

                            var updateScopeLater = _.throttle(function() {
                                safeApply.call(scope, function() {
                                    scope.fiddle[content] = editor.getValue();
                                    scope.fiddle.aceOptions = {
                                        cursorPosition: editor.getCursorPosition(),
                                        selectionRange: JSON.parse(JSON.stringify(editor.getSelectionRange())),
                                        firstVisibleRow: editor.getFirstVisibleRow(),
                                        lastVisibleRow: editor.getLastVisibleRow()
                                    };
                                    // Do not trigger events if only cursor position changes
                                    if (shouldTriggerEvent) {
                                        sliderPlugins.trigger('slide.slide-fiddle.change', fiddleCopy(scope));
                                    }
                                    shouldTriggerEvent = false;
                                });
                            }, 100, {
                                leading: false,
                                trailing: true
                            });

                            var reloadFiddle = function() {
                                var selection = editor.getSelection();
                                selection.moveCursorToPosition(scope.fiddle.aceOptions.cursorPosition);
                                //var range = scope.fiddle.aceOptions.selectionRange;                                   
                                //selection.setSelectionRange(range, false);
                                editor.scrollToRow(scope.fiddle.aceOptions.firstVisibleRow);
                            };

                            scope.$watch('fiddle.' + content, function() {
                                if (editor.getValue() !== scope.fiddle[content]) {
                                    scope.active = content;
                                    editor.setValue(scope.fiddle[content]);
                                    editor.clearSelection();
                                    if (!$rootScope.modes.isSliderMode) {
                                        reloadFiddle();
                                    }
                                }
                            });




                            editor.on('change', function() {
                                var newValue = editor.getValue();
                                if (scope.fiddle[content] !== newValue) {
                                    shouldTriggerEvent = true;
                                    updateScopeLater();
                                }
                            });

                            if ($rootScope.modes.isSliderMode) {
                                editor.getSession().getSelection().on('changeCursor', function() {
                                    updateScopeLater();
                                });
                            }

                            sliderPlugins.onLoad(function() {
                                sliderPlugins.trigger('slide.slide-fiddle.change', fiddleCopy(scope));
                            });
                        });
                    });

                    handleListeners(scope, $window);
                }
            };
        }
    ]);

});