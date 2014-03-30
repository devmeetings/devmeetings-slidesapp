require(['config'], function () {
    require(['angular-route', 'restangular'], function (angular) {
        var module = angular.module('slider-admin', ['ngRoute', 'restangular']);


        module.controller('AdminSlidesListCtrl', ['$scope', 'Restangular', function($scope, Restangular) {
            Restangular.all('api/decks').getList().then(function(decks){
                $scope.decks = decks;
            });
        }]);

        module.config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/list', {
                templateUrl: 'partials/admin-list',
                controller: 'AdminSlidesListCtrl'
            }).otherwise({
                redirectTo: '/list'
            });
        }]);

        angular.bootstrap(document, ['slider-admin']);
    });
});