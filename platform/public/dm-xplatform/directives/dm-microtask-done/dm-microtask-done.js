define(['angular', 'xplatform/xplatform-app', 'slider/slider.plugins'], function (angular, xplatformApp, sliderPlugins) {
    sliderPlugins.registerPlugin('microtask', '*', 'microtask-done', 500).directive('microtaskDone', [
        '$http', '$stateParams', '$rootScope', function ($http, $stateParams, $rootScope) {
            return {
                restrict: 'E',
                scope: {
                    microtask: '=context'
                },
                link: function (scope, element) {
                    scope.$watch('microtask.meta.completed', function (completed) {
                        if (completed) {
                            scope.microtask.slide.snippet.done = true; 
                            if ($rootScope.modes.isTaskMode) {
                                //$http.post('/api/event/task_done/' + $stateParams.event + '/' + scope.microtask.taskName);
                            }
                        }
                    });
                }
            }
        }
    ]);
});
