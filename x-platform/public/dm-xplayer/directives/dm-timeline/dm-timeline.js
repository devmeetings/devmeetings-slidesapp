/* globals define */
define(['angular', 'dm-xplayer/dm-xplayer-app', './dm-timeline.html!text'], function (angular, xplayerApp, viewTemplate) {
  'use strict';

  xplayerApp.directive('dmTimeline', ['$window', '$timeout', function ($window, $timeout) {
    return {
      restrict: 'E',
      scope: {
        second: '=',
        length: '=',
        annotations: '=*'
      },
      template: viewTemplate,
      link: function (scope, element) {
        scope.$watch('second', function (second) {
          second = second || 0;
          var length = scope.length || 1;
          scope.value = second * 100 / length;
        });

        scope.$watchCollection('annotations', function (annos) {
          annos = annos || [];
          scope.annos = annos.filter(function (anno) {
            return anno.type !== 'snippet' && anno.type !== 'task' && anno.timestamp;
          });
        });

        var el = element[0];

        function fixSize () {
          if (!isRunning) {
            return;
          }

          var newSize = el.clientWidth;
          if (scope.size !== newSize) {
            scope.size = newSize;
            scope.$digest();
          }

          setTimeout(fixSize, 3000);
        }

        var isRunning = true;
        setTimeout(function () {
          fixSize();
        }, 500);

        $window.addEventListener('resize', fixSize);
        scope.$on('$destroy', function () {
          isRunning = false;
          $window.removeEventListener('resize', fixSize);
        });
      }
    };
  }]);
});
