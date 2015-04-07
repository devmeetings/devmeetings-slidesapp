define(['angular', 'dm-xplayer/dm-xplayer-app'], function(angular, xplayerApp) {
  'use strict';

  xplayerApp.directive('dmTimeline', ['$window', '$timeout', function($window, $timeout) {
    return {
      restrict: 'E',
      scope: {
        second: '=',
        length: '=',
        annotations: '=*'
      },
      templateUrl: '/static/dm-xplayer/directives/dm-timeline/dm-timeline.html',
      link: function(scope, element) {

        scope.$watch('second', function(second) {
          scope.value = second * 100 / scope.length;
        });

        scope.$watchCollection('annotations', function(annos) {
          annos = annos || [];
          scope.annos = annos.filter(function(anno) {
            return anno.type !== 'snippet' && anno.type !== 'task';
          });
        });

        function fixSize() {
          scope.size = element[0].clientWidth;
        }

        $timeout(function() {
          fixSize();
        }, 500);

        $window.addEventListener('resize', fixSize);
        scope.$on('$destroy', function() {
          $window.removeEventListener('resize', fixSize);
        });
      }
    };
  }]);
});
