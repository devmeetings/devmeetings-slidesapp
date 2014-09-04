define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.directive('dmSidebar', [function () {
        return {
            restrict: 'E',
            scope: {
                snippets: '=',
                tasks: '=',
                currentTime: '=',
                editMethod: '=',
                deleteMethod: '='
            },
            templateUrl: '/static/dm-xplatform/directives/dm-sidebar/dm-sidebar.html'
        };
    }]);
});
