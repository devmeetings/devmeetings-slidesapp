define(['module', '_', 'slider/slider.plugins', 'ace', './fiddleOutput'], function(module, _, sliderPlugins, ace) {
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
            html: '<html><head></head><body></body></html'
        }, scope.fiddle);
    };

    var getActive = function(scope) {
        if (scope.fiddle.active) {
            return scope.fiddle.active;
        }

        var keys = _.keys(scope.fiddle);
        return _.find(['js', 'coffee', 'css', 'html'], function(key) {
            return _.contains(keys, key);
        });

    };


    var safeApply = function (fn) {
        var phase = this.$root.$$phase;

        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    sliderPlugins.registerPlugin('slide', 'fiddle', 'slide-fiddle', 5000).directive('slideFiddle', [
        '$timeout', '$window',
        function($timeout, $window) {
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
                            editor.setTheme("ace/theme/" + EDITOR_THEME);
                            editor.getSession().setMode("ace/mode/" + e.getAttribute('data-mode'));
                            var content = e.getAttribute('data-content');

                            var updateScopeLater = _.throttle(function() {
                                safeApply.call(scope, function() {
                                    scope.fiddle[content] = editor.getValue();
                                    scope.fiddle.aceOptions = {
                                        cursorPosition: editor.getCursorPosition(),
                                        selectionRange: editor.getSelectionRange(),
                                        firstVisibleRow: editor.getFirstVisibleRow(),
                                        lastVisibleRow: editor.getLastVisibleRow()
                                    };
                                    sliderPlugins.trigger('slide.slide-fiddle.change', fiddleCopy(scope));
                                });
                            }, 100, {
                                leading: false,
                                trailing: true
                            });

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
                            });
                            
                            editor.getSession().getSelection().on('changeCursor', function () {
                                updateScopeLater();
                            });

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