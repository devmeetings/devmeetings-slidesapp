define(["module", "angular", "_", "ace", 'slider/slider.plugins'], function(module, angular, _, ace, sliderPlugins) {
    var path = sliderPlugins.extractPath(module);

    var UPDATE_THROTTLE_TIME = 1000;

    var toNiceJson = function(str) {
        return JSON.stringify(str, null, 2);
    };

    var toNiceJsonFromString = function(string) {
        return toNiceJson(JSON.parse(string));
    };

    sliderPlugins.registerPlugin('slide.edit', '*', 'slideedit-editor', 0).directive('slideeditEditor', ['$rootScope', "$window", "$http",
        function($rootScope, $window, $http) {
            return {
                restrict: 'E',
                scope: {
                    slide: '=context'
                },
                templateUrl: path + "/editor.html",
                link: function(scope, element) {
                    var editor = ace.edit(element.find('.editor')[0]);
                    editor.setTheme('ace/theme/todr');
                    editor.getSession().setMode('ace/mode/json');
                    editor.setValue(JSON.stringify(scope.slide, null, 2));
                    editor.clearSelection();

                    var updateSlideContent = function() {
                        var value = editor.getValue();
                        scope.$apply(function() {
                            try {
                                scope.slide = JSON.parse(value);
                                $rootScope.$broadcast('slide', scope.slide);
                            } catch (e) {
                                console.warn(e);
                            }
                        });
                    };

                    var updateSlideContentThrottled = _.throttle(updateSlideContent, UPDATE_THROTTLE_TIME, {
                        leading: false,
                        trailing: true
                    });
                    editor.on('change', updateSlideContentThrottled);

                    scope.$watch('slide', _.throttle(function(newSlide, oldSlide) {
                        if (newSlide === undefined) {
                            return;
                        }

                        // Copy slide to cut off some angular properties
                        var slideCopy = angular.copy(newSlide);
                        // Convert to nice json
                        var slideString = toNiceJson(slideCopy);
                        // To compare content instead of formatting issues reformat to JSON
                        var editorContentFormatted = toNiceJsonFromString(editor.getValue());

                        if (editorContentFormatted !== slideString) {
                            editor.off('change', updateSlideContentThrottled);
                            var cursorPosition = editor.getCursorPosition();
                            editor.setValue(slideString);
                            editor.clearSelection();
                            editor.moveCursorToPosition(cursorPosition);
                            editor.on('change', updateSlideContentThrottled);
                        }

                    }, UPDATE_THROTTLE_TIME, {
                        leading: false,
                        trailing: true
                    }), true);
                }
            };
        }
    ]);

});