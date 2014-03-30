require(['config'], function () {
    require(['angular-route', 'restangular'], function (angular) {
        var module = angular.module('slider-admin', ['ngRoute', 'restangular']);


        module.controller('AdminSlidesListCtrl', ['$scope', 'Restangular', function ($scope, Restangular) {
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

            $scope.addDeck = function() {
                var title = $scope.deckTitle;
                $scope.deckTitle = "";

                decks.post({
                    title: title
                }).then(fetchDecks);
            }
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