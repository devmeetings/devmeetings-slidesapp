/* globals define */
define(['slider/slider'], function (slider) {
  slider.directive('splitter', [

    function () {
      return {
        restrict: 'E',
        template: '',
        link: function (scope, element) {
          var section = element.children('section');
          var aside = element.children('aside');

          scope.splitter = {
            size: 12
          };
        }
      };
    }
  ]);
});
