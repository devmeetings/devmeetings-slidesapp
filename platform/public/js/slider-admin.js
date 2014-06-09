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

            var fetchSlides = function () {
                $http.get('/api/slides').success( function (data, status) {
                    $scope.slides = data;
                });
            };
            fetchSlides();

            $scope.removeSlideAtIndex = function (slides, index) {
                var slide = slides[0];
                slides.splice(index, 1);
                //TODO send put to API
            };

            $scope.addSlideToDeck = function (deck, slides, slide) {
                if (_.contains(deck.slides, slide._id)){
                    return;
                }
                deck.slides.push(slide._id);
                slides.push(slide);
                $http.put('/api/decks/' + deck._id, deck);
            };

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
