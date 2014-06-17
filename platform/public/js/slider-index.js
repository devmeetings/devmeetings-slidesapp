require(['config'], function () {
    require(['angular', '_', 'angular-deckgrid', 'angular-gravatar', 'slider/slider', 'services/User'], function (angular, _, angularDeckgrid, angularGravatar, slider, User) {
        var module = angular.module('slider-index', ['akoenig.deckgrid', 'slider', 'ui.gravatar']);

        module.controller('IndexCtrl', ['$scope', '$http', '$filter', 'User', function ($scope, $http, $filter, User) {
            $scope.bricks = [
                {id: 'p1', 'title': 'A nice day!', src: "http://lorempixel.com/300/400/"},
                {id: 'p2', 'title': 'Puh!', src: "http://lorempixel.com/300/400/sports"},
                {id: 'p3', 'title': 'What a club!', src: "http://lorempixel.com/300/400/nightlife"},
                {id: 'p1', 'title': 'A nice day!', src: "http://lorempixel.com/300/400/"},
                {id: 'p2', 'title': 'Puh!', src: "http://lorempixel.com/300/400/sports"},
                {id: 'p3', 'title': 'What a club!', src: "http://lorempixel.com/300/400/nightlife"}
            ];

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
