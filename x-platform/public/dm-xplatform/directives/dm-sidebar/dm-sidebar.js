define(['angular', 'dm-xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.directive('dmSidebar', [function () {
        return {
            restrict: 'E',
            scope: {
                snippets: '=',
                tasks: '=',
                currentTime: '=',
                editMethod: '=',
                deleteMethod: '=',
                context: '='
            },
            templateUrl: '/static/dm-xplatform/directives/dm-sidebar/dm-sidebar.html',
            link: function (scope) {
                scope.$watch('context', function () {
                    
                });
            }
        };
    }]);
});
