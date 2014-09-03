define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.directive('dmTimeline', [function() {
        return {
            restrict: 'E',
            scope: {
                points: '=',
                snippets: '=',
                length: '=',
                callback: '='
            },
            //replace: true,
            templateUrl: '/static/dm-xplatform/directives/dm-timeline/dm-timeline.html',
            link: function (scope, element) {
            }
        };
    }]);
});

