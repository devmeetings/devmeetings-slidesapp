define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.directive('dmSpaceSidebar', [function () {
        return {
            restrict: 'E',
            scope: {
                width: '='
            },
            transclude: true,
            templateUrl: '/static/dm-xplatform/directives/dm-spacesidebar/dm-spacesidebar.html',
            link: function (scope, element) {
                
            }
        };
    }]);
});
