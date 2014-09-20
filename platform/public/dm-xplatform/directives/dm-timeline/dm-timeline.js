define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.directive('dmTimeline', [function() {
        return {
            restrict: 'E',
            scope: {
                length: '=',
                annotations: '='
            },
            templateUrl: '/static/dm-xplatform/directives/dm-timeline/dm-timeline.html',
            link: function (scope, element) {
                scope.points = [{
                    type: 'snippet',
                    timestamp: 100,
                    title: 'test',
                    description: 'desc'
                },{
                    type: 'task',
                    timestamp: 200,
                    title: 'test',
                    description: 'desc'
                }];
            }
        };
    }]);
});

