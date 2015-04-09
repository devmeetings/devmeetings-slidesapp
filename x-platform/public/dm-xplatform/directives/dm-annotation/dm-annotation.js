define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
  'use strict';

    xplatformApp.directive('dmAnnotation', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                annotation: '=',
                showIteration: '='
            },
            templateUrl: '/static/dm-xplatform/directives/dm-annotation/dm-annotation.html',
            link: function (scope, element, attrs) {
                var fixLinks = function () {
                    $timeout(function () {
                        var link = element.find('.dm-anno-markdown a');
                        if (!link.length) {
                            return;
                        }
                        link.attr('target', '_blank');
                    });
                };
                fixLinks();

                scope.$watch('annotation', fixLinks);
            }
        };
    }]);
});

