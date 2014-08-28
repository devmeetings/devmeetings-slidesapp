define(['angular', 'xplatform/xplatform-app'], function(angular, xplatformApp) {
    xplatformApp.directive('dmMicrotask', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    dmFinished: '=',
                    dmText: '=',
                    dmUsers: '='
                },
                templateUrl: '/static/dm-xplatform/directives/dm-microtask/dm-microtask.html',
                link: function(scope, element) {
                    scope.taskImage = scope.dmFinished ? '/static/images/microtask/mt_completed.png' : '/static/images/microtask/mt_star.png';
                }
            };
        }
    ]);
});
