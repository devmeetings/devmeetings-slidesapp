require(['config'], function () {
    require(['angular', '_', 'angular-masonry'], function (angular, _, angularMasonry) {
        var module = angular.module('slider-index', ['wu.masonry']);

        module.controller('IndexCtrl', ['$scope', function ($scope) {
            $scope.bricks = [
                "brick1",
                "brick2"
            ];
        }]);
        
        angular.bootstrap(document, ['slider-index']);
    });
});
