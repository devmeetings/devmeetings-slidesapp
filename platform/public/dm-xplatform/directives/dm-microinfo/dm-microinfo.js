define(['angular', 'xplatform/xplatform-app'], function(angular, xplatformApp) {
    xplatformApp.directive('dmMicroinfo', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    dmInfo: '='
                },
                templateUrl: '/static/dm-xplatform/directives/dm-microinfo/dm-microinfo.html',
                link: function(scope, element) {
                }
            };
        }
    ]);
});
