define(['module', '_', 'slider/slider.plugins'],
  function(module, _, sliderPlugins) {
    'use strict';
    sliderPlugins.directive('swSplitter', function($window) {

      return {
        replace: true,
        restrict: 'E',
        template: '<div class="sw-col-grip full-height"></div>',
        scope: {
          left: '=',
          right: '=',
          dragActive: '='
        },
        link: function(scope, element) {
          scope.left = '50%';
          scope.right = 'calc(50% - 3px)';

          function listenToClick() {
            scope.$apply(function() {
              scope.dragActive = true;
              $window.addEventListener('mousemove', listenToDragSlowly);
              $window.addEventListener('mouseup', listenToUp);
            });
          }

          function listenToUp() {
            $window.removeEventListener('mousemove', listenToDragSlowly);
            $window.removeEventListener('mouseup', listenToUp);

            scope.$apply(function() {
              scope.dragActive = false;
            });
          }

          function listenToDrag(ev) {
            scope.$apply(function() {
              var width = 100 * ev.screenX / $window.screen.availWidth;
              scope.left = width + '%';
              scope.right = 'calc(' + (100 - width) + '% - 3px)';
            });
          }

          var listenToDragSlowly = _.throttle(listenToDrag, 150);

          element[0].addEventListener('mousedown', listenToClick);

          scope.$on('$destroy', function() {
            element[0].removeEventListener('mousedown', listenToClick);
          });
        }
      };
    });
  });
