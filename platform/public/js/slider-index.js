require(['config'], function () {
    require(['angular', '_', 'angular-deckgrid', 'angular-gravatar', 'angular-ui-router', 'slider/slider', 'services/User'], function (angular, _, angularDeckgrid, angularGravatar, angularRouter, slider, User) {
        var module = angular.module('slider-index', ['akoenig.deckgrid', 'slider', 'ui.gravatar', 'ui.router']);

        module.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            
        }]);

        module.controller('IndexCtrl', ['$scope', '$http', '$filter', 'User', function ($scope, $http, $filter, User) {

            $scope.searchText = '';
            $http.get('/api/decks').then( function (decks) {
                $scope.decks = decks.data;    

                $scope.$watch('searchText', function (newVal, oldVal) {
                    $scope.decksToDisplay = $filter('filter')($scope.decks, {title: newVal});
                });
            });

            $scope.star = function (event, deck) {
                event.preventDefault();
            };




            User.getUserData( function (data) {
                $scope.user = data;
            });
        }]);
        
        angular.bootstrap(document, ['slider-index']);
    });
});



