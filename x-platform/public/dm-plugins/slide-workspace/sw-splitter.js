/* globals define */
define(['module', '_', 'slider/slider.plugins'],
  function (module, _, sliderPlugins) {
    'use strict';
    sliderPlugins.directive('swSplitter', function ($window) {
      return {
        replace: true,
        restrict: 'E',
        template: '<div ng-class="{' +
          "'sw-col-grip full-height': isRow !== 'true'," +
          '\'sw-row-grip\': isRow === \'true\' }"></div>',
        scope: {
          isRow: '@',
          left: '=',
          right: '=',
          dragActive: '='
        },
        link: function (scope, element) {
          if (!scope.left) {
            scope.left = '50%';
            scope.right = 'calc(50% - 3px)';
          }

          var currentDiff = 0;

          function listenToClick (ev) {
            calcDiff(ev);
            scope.$apply(function () {
              scope.dragActive = true;
              $window.addEventListener('mousemove', listenToDragSlowly);
              $window.addEventListener('mouseup', listenToUp);
            });
          }

          function listenToUp () {
            $window.removeEventListener('mousemove', listenToDragSlowly);
            $window.removeEventListener('mouseup', listenToUp);

            scope.$apply(function () {
              scope.dragActive = false;
            });
          }

          function calcWidthDiff (ev) {
            var width = parseFloat(scope.left);
            var widthPx = width * $window.screen.availWidth / 100;
            currentDiff = -ev.screenX + widthPx;
          }

          function fixWidth (ev) {
            var width = 100 * (ev.screenX + currentDiff) / $window.screen.availWidth;
            scope.left = width + '%';
            scope.right = 'calc(' + (100 - width) + '% - 3px)';
          }

          function calcHeightDiff (ev) {
            var height = parseFloat(scope.left);
            var heightPx = height * $window.screen.availHeight / 100;
            currentDiff = -ev.screenY + heightPx;
          }

          function fixHeight (ev) {
            var height = 100 * (ev.screenY + currentDiff) / $window.screen.availHeight;
            scope.left = height + '%';
            scope.right = 'calc(' + (100 - height) + '% - 3px)';
          }

          var fixProps = scope.isRow === 'true' ? fixHeight : fixWidth;
          var calcDiff = scope.isRow === 'true' ? calcHeightDiff : calcWidthDiff;

          function listenToDrag (ev) {
            scope.$apply(fixProps.bind(null, ev));
          }

          var listenToDragSlowly = _.throttle(listenToDrag, 100);

          element[0].addEventListener('mousedown', listenToClick);

          scope.$on('$destroy', function () {
            element[0].removeEventListener('mousedown', listenToClick);
          });
        }
      };
    });
  });
