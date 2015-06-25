/* globals define */
define(['angular', 'dm-xplatform/xplatform-app', './dm-annotation-group.html!text'], function (angular, xplatformApp, viewTemplate) {
  xplatformApp.directive('dmAnnotationGroup', [
    function () {
      return {
        restrict: 'E',
        scope: {
          group: '=',
        },
        template: viewTemplate
      };
    }
  ]);
});
