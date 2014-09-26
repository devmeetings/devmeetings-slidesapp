define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.directive('dmMicrotask', [function () {
        return {
            restrict: 'E',
            scope: {
                microtask: '=',
                context: '='
            }, 
            templateUrl: '/static/dm-xplatform/directives/dm-microtask/dm-microtask.html',
            link: function (scope, element, attr) {
                
            }
        };
    }]);
});

