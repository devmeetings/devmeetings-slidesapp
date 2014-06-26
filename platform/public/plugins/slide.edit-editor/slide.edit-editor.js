define(["module", "_", "ace", 'slider/slider.plugins'], function(module, _, ace, sliderPlugins) {
    var path = sliderPlugins.extractPath(module);

    var UPDATE_THROTTLE_TIME = 1000;

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

                    var updateSlideContentThrottled = _.throttle(updateSlideContent, UPDATE_THROTTLE_TIME);
                    editor.on('change', updateSlideContentThrottled);

                    scope.$watch('slide', _.throttle(function(newSlide, oldSlide) {
                        if (newSlide === undefined) {
                            return;
                        }

                        var slideString = JSON.stringify(newSlide, null, 2);
                        if (editor.getValue() !== slideString) {
                            editor.off('change', updateSlideContentThrottled);
                            editor.setValue(slideString);
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