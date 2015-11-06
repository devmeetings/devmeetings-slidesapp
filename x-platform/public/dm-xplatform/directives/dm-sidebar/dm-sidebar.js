/* globals define */
define(['angular', 'dm-xplatform/xplatform-app', './dm-sidebar.html!text'], function (angular, xplatformApp, viewTemplate) {
  xplatformApp.directive('dmSidebar', [ function () {
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
      template: viewTemplate,
      link: function (scope) {
        scope.$watch('context', function () {});
      }
    };
  }]);
});
