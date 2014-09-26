define(['angular', 'xplatform/xplatform-app', 'xplatform/directives/dm-taskicon/dm-taskicon'], function (angular, xplatformApp) {
    xplatformApp.directive('dmTimeline', [function() {
        return {
            restrict: 'E',
            scope: {
                length: '=',
                annotations: '='
            },
            templateUrl: '/static/dm-xplatform/directives/dm-timeline/dm-timeline.html',
            link: function (scope, element) {
            }
        };
    }]);
});

