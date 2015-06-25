/* globals define */
define(['slider/slider'], function (slider) {
  slider.directive('layoutLoader', ['$compile',
    function ($compile) {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          layout: '=',
          extra: '='
        },
        template: '',
        link: function ($scope, $element) {
          var el = $compile('<' + $scope.layout + ' data="data" extra="extra"></' + $scope.layout + '>')($scope);
          $element.append(el);
        }
      };
    }
  ]);
});
