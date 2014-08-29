define(['angular', 'xplatform/xplatform-app', 'slider/slider.plugins'], function (angular, xplatformApp, sliderPlugins) {
    sliderPlugins.registerPlugin('microtask', '*', 'microtask-done', 500).directive('microtaskDone', [
        '$http', '$stateParams', function ($http, $stateParams) {
            return {
                restrict: 'E',
                scope: {
                    microtask: '=context'
                },
                link: function (scope, element) {
                    scope.$watch('microtask.completed', function (completed) {
                        if (completed) {
                            if ($rootScope.modes.isTaskMode) {
                                $http.post('/api/event/task_done/' + $stateParams.event + '/' + $stateParams.id);
                            }
                        }
                    });
                }
            }
        }
    ]);
});
