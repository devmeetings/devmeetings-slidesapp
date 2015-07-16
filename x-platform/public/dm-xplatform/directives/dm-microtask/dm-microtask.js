/* globals define */
define(['angular', 'dm-xplatform/xplatform-app', './dm-microtask.html!text'], function (angular, xplatformApp, viewTemplate) {
  xplatformApp.directive('dmMicrotask', [
    '$timeout',
    function ($timeout) {
      return {
        restrict: 'E',
        scope: {
          microtask: '=',
          context: '='
        },
        template: viewTemplate,
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
