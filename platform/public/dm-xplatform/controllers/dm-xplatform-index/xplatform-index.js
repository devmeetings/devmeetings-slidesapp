define(['module', 'angular', '_', 'angular-deckgrid', 'xplatform/xplatform-app', 'slider/slider', 'utils/ExtractPath'], function (module, angular, _, angularDeckgrid, xplatformApp, slider, ExtractPath) {

    var path = ExtractPath(module);
    
    angular.module('xplatform').controller('XplatformIndexCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
        var className = '.dm-xplatform-index';

        var changeWidthTo = function (className, width) {
            var col = 'col-md-' + width;
            var element = $('[class*="' + className + '"]');
            element.removeClass();
            element.addClass(className);
            element.addClass(col);

            if (width === 0) {
                element.css('height', '0px');
            } else {
                element.css('height', '100%');
            }
        }

        var reloadCols = function () {
            changeWidthTo('dm-xplatform-index-left', $scope.xplatformData.columns.left);
            changeWidthTo('dm-xplatform-index-mid', $scope.xplatformData.columns.mid);
            changeWidthTo('dm-xplatform-index-right', $scope.xplatformData.columns.right);
        };

        $scope.$watch('xplatformData.columns', reloadCols);
    
    }]); 
});



