define(['angular', 'xplatform/xplatform-app', 'slider/slider.plugins'], function (angular, xplatformApp, sliderPlugins) {
    sliderPlugins.registerPlugin('microtask', '*', 'microtask-users', 500).directive('microtaskUsers', [
        '$http', function ($http) {
            return {
                restrict: 'E',
                scope: {
                    microtask: '=context'
                },
                templateUrl: '/static/dm-xplatform/directives/dm-microtask-users/dm-microtask-users.html',
                link: function (scope, element) {
                    scope.$on('dm-xplatform-task-people', function(obj, people) {
                        scope.people = people;
                    });
                }
            }
        }
    ]);
});

