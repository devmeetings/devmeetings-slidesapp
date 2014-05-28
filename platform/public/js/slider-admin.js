require(['config'], function () {
    require(['angular-route', 'restangular'], function (angular) {
        var module = angular.module('slider-admin', ['ngRoute', 'restangular']);


        module.controller('AdminSlidesListCtrl', ['$scope', 'Restangular', '$http', function ($scope, Restangular, $http) {
            var decks = Restangular.all('api/decks');
            var fetchDecks = function () {
                decks.getList().then(function (decks) {
                    $scope.decks = decks;
                });
            };
            fetchDecks();

            $scope.removeDeck = function (id) {
                decks.one(id).remove().then(fetchDecks);
            };

            $scope.addDeck = function () {
                var title = $scope.deckTitle;
                $scope.deckTitle = "";

                decks.post({
                    title: title
                }).then(fetchDecks);
            };

            $scope.addExemplaryDeck = function () {
                require(['data-slides', 'data-deck'], function (slides, deck) {
                    $http.put('/api/slides/', slides).success( function (data, status) {
                        deck.slides = data;
                        $scope.decks = decks;
                        $http.put('/api/decks', deck);
                    });
                    //decks.post(exemplaryData).then(fetchDecks);
                });
            };
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
