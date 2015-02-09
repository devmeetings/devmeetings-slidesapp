define(['angular', 'xplatform/xplatform-app', 'xplatform/directives/dm-taskicon/dm-taskicon'], function (angular, xplatformApp) {
  xplatformApp.directive('dmTimeline', [function() {
    return {
      restrict: 'E',
      scope: {
        second: '=',
        length: '=',
        annotations: '='
      },
      templateUrl: '/static/dm-xplatform/directives/dm-timeline/dm-timeline.html',
      link: function (scope, element) {

        scope.$watch('second', function(second) {
          scope.value = second * 100 / scope.length;
        });

      }
    };
  }]);
});

