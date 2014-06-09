require(['config'], function () {
    require(['angular-route', 'restangular'], function (angular) {
        var module = angular.module('slider-admin', ['ngRoute', 'restangular']);


        module.controller('AdminSlidesListCtrl', ['$scope', 'Restangular', '$http', function ($scope, Restangular, $http) {
            var decks = Restangular.all('api/decks');
            var fetchDecks = function () {
                 decks.getList().then(function (deckList) {
                    $scope.decks = deckList;
                });
            };
            fetchDecks();

            $scope.selectDeck = function (deck) {
                $scope.selected = deck;
                $scope.selectedSlides = [];
                require(['require/decks/' + deck._id + '/slides'], function (slides, deck) {
                    $scope.$apply( function () {
                        $scope.selectedSlides = slides;
                    });
                });
            };

            $scope.removeFromDeckSlideAtIndex = function (deck, slides, index) {
                deck.slides.splice(index, 1);
                slides.splice(index, 1);
                $http.put('/api/decks/' + deck._id, deck);
            };

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
                    $http.post('/api/slides', slides).success( function (data, status) {
                        deck.slides = data;
                        decks.post(deck).then(function (){
                            $scope.decks.push(deck);
                        });
                    });
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
