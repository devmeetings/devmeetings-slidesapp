define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.directive('dmSnippet', [function () {
        return {
            restrict: 'E',
            scope: {
                snippet: '=',
                currentTime: '='
            },
            templateUrl: '/static/dm-xplatform/directives/dm-snippet/dm-snippet.html',
            link: function (scope, element) {
            
            }
        };
    }]);
});
