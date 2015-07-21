/* globals define */
define(['angular', 'slider/slider', './dm-taskicon.html!text'], function (angular, slider, viewTemplate) {
  var images = {
    task: {
      image: 'fa-star',
      color: 'rgb(254,251,0)'
    },
    taskDone: {
      image: 'fa-check',
      color: 'rgb(57,179,74)'
    },
    snippet: {
      image: 'fa-file-text',
      color: '#5aabcb'
    }
  };

  slider.directive('dmTaskicon', [

    function () {
      return {
        restrict: 'E',
        scope: {
          type: '='
        },
        replace: 'true',
        template: viewTemplate,
        link: function (scope, element, attr) {
          scope.images = images;
        }
      };
    }
  ]);
});
