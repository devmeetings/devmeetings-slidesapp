define(['angular', 'xplatform/xplatform-app'], function(angular, xplatformApp) {
    xplatformApp.directive('dmMicrotask', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    dmFinished: '@',
                    dmText: '@',
                    dmUsers: '@'
                },
                templateUrl: '/static/dm-xplatform/directives/microtask.html',
                link: function(scope, element) {

                }
            };
        }
    ]);
});