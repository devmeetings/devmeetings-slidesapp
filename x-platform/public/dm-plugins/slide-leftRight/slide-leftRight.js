/* globals define */
define(['module', 'slider/slider.plugins', './part.html!text'], function (module, sliderPlugins, viewTemplate) {
  'use strict';

  sliderPlugins.registerPlugin('slide', 'left', 'slide-left', {
    order: 9,
    name: 'Split Left',
    description: 'Displays content on the left side of slide',
    example: {
      meta: {
        type: 'SlideObject'
      },
      data: {
        text: 'Some text on the left'
      }
    }
  }).directive('slideLeft', [

    function () {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          left: '=data',
          slide: '=context',
          path: '@'
        },
        template: viewTemplate,
        link: function (scope) {
          scope.$watch(function () {
            return scope.slide.right;
          }, function (right) {
            scope.right = right;
          });

          scope.getRightPath = function (path) {
            return path.replace(/left$/, 'right');
          };
        }
      };
    }
  ]);

  sliderPlugins.registerPlugin('slide', 'right', 'slide-right', {
    order: 10,
    name: 'Split Right',
    description: 'Displays content on the right side of slide',
    example: {
      meta: {
        type: 'SlideObject'
      },
      data: {
        text: 'Some text on the right'
      }
    }
  });
});
