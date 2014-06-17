require(['config'], function () {
    require(['angular', '_', 'angular-deckgrid'], function (angular, _, angularDeckgrid) {
        var module = angular.module('slider-index', ['akoenig.deckgrid']);

        module.controller('IndexCtrl', ['$scope', '$http', function ($scope, $http) {
            $scope.bricks = [
                {id: 'p1', 'title': 'A nice day!', src: "http://lorempixel.com/300/400/"},
                {id: 'p2', 'title': 'Puh!', src: "http://lorempixel.com/300/400/sports"},
                {id: 'p3', 'title': 'What a club!', src: "http://lorempixel.com/300/400/nightlife"},
                {id: 'p1', 'title': 'A nice day!', src: "http://lorempixel.com/300/400/"},
                {id: 'p2', 'title': 'Puh!', src: "http://lorempixel.com/300/400/sports"},
                {id: 'p3', 'title': 'What a club!', src: "http://lorempixel.com/300/400/nightlife"}
            ];

            $http.get('/api/decks').then( function (decks) {
                $scope.decks = decks.data;    
            });
            //global, fix this
            //$scope.bricks = [
            //    "brick1",
            //    "brick2"
            //];
        }]);
        
        angular.bootstrap(document, ['slider-index']);
    });
});
