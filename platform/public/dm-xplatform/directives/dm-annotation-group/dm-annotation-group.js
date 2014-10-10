define(['angular', 'xplatform/xplatform-app'], function(angular, xplatformApp) {

   

    xplatformApp.directive('dmAnnotationGroup', [
        function() {
            return {
                restrict: 'E',
                scope: {
                    group: '=',
                },
                templateUrl: '/static/dm-xplatform/directives/dm-annotation-group/dm-annotation-group.html'
            }
        }
    ]);
});