/* globals define */
define(['angular', 'dm-xplatform/xplatform-app', './dm-annotation.html!text'], function (angular, xplatformApp, viewTemplate) {
  'use strict';

  xplatformApp.directive('dmAnnotation', ['$timeout', function ($timeout) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        annotation: '=',
        showIteration: '='
      },
      template: viewTemplate,
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
