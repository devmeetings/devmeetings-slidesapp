/* globals define */
define(['$', 'angular', '_', 'dm-xplatform/xplatform-app', 'slider/slider', 'utils/ExtractPath'], function ($, angular, _, xplatformApp, slider, ExtractPath) {

  angular.module('xplatform').controller('XplatformIndexCtrl', ['$scope', '$http', '$filter',
    function ($scope, $http, $filter) {

      var changeWidthTo = function (className, width) {
        var col = 'col-xs-' + width;
        var element = $('[class*="' + className + '"]');
        element.removeClass();
        element.addClass(className);
        element.addClass(col);
        element.toggle(width !== 0);
      };

      var reloadCols = function () {
        changeWidthTo('dm-xplatform-index-left', $scope.xplatformData.columns.left);
        changeWidthTo('dm-xplatform-index-mid', $scope.xplatformData.columns.mid);
        changeWidthTo('dm-xplatform-index-right', $scope.xplatformData.columns.right);
      };

      $scope.$watch('xplatformData.columns', reloadCols);

    }
  ]);
});
