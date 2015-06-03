define(['angular', 'dm-xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.directive('dmMicrotask', [
        '$timeout',
        function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                microtask: '=',
                context: '='
            }, 
            templateUrl: '/static/dm-xplatform/directives/dm-microtask/dm-microtask.html',
            link: function (scope, element, attr) {
                var fixLinks = function () {
                    $timeout(function () {
                        var link = element.find('.microtask-desc a');
                        if (!link.length) {
                            return;
                        }
                        link.attr('target', '_blank');
                    });
                };
                fixLinks();
                scope.$watch('microtask', fixLinks);
            }
        };
    }]);
});

