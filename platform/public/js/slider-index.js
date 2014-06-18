require(['config'], function () {
    require(['angular', '_', 'angular-deckgrid', 'angular-gravatar', 'angular-ui-router', 'slider/slider', 'services/User'], function (angular, _, angularDeckgrid, angularGravatar, angularRouter, slider, User) {
        var module = angular.module('slider-index', ['akoenig.deckgrid', 'slider', 'ui.gravatar', 'ui.router']);

        module.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider.state('index', {
                url: '/index',
                views: {
                    navbar: {
                        templateUrl: '/static/partials/navbar/navbar.html',
                    },
                    content: {
                        templateUrl: '/static/partials/deckgrid/deckgrid.html',
                    }
                }
            });
            $urlRouterProvider.otherwise('/index');
        }]);

        module.controller('IndexCtrl', ['$scope', '$http', '$filter', 'User', function ($scope, $http, $filter, User) {
            $scope.app = {
                searchText: '',
                decks: [],
                decksToDisplay: [],
                star: function (event, deck) {
                    event.preventDefault();
                },
                user: {}
            };

            $http.get('/api/decks').then( function (decks) {
                $scope.app.decks = decks.data;    

                $scope.$watch('app.searchText', function (newVal, oldVal) {
                    $scope.app.decksToDisplay = $filter('filter')($scope.app.decks, {title: newVal});
                });
            });

            User.getUserData( function (data) {
                $scope.app.user = data;
            });
        }]);
        
        angular.bootstrap(document, ['slider-index']);
    });
});



