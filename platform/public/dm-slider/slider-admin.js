require(['config'], function () {
    require(['angular', 'restangular', '_', 'angular-ui-sortable', 'angular-ui-router'], function (angular, restangular, _, angularSortable, angularRouter) {
        var module = angular.module('slider-admin', ['restangular', 'ui.sortable', 'ui.router']);

        module.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider.state('list', {
                url: '/list',
                templateUrl: '/admin/partials/admin-list',
                controller: 'AdminSlidesListCtrl'
            });
            $urlRouterProvider.otherwise('/list');
        }]);

        module.controller('AdminSlidesListCtrl', ['$scope', 'Restangular', '$http', function ($scope, Restangular, $http) {
            $scope.deckSlidesSearch = "";
            $scope.allSlidesSearch = "";
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

            $scope.removeSlide = function (slides, slide) {
                var index = _.pluck(slides, '_id').indexOf(slide._id);
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

            $scope.orderUpdated = {
                stop: function(em, ui) {
                    $scope.selected.slides = _.pluck($scope.selectedSlides, '_id');
                    $http.put('/api/decks/' + $scope.selected._id, $scope.selected);
                }
            };

            $scope.removeSlideFromDeck = function (deck, slides, slide) {
                var index = deck.slides.indexOf(slide._id);
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

        angular.bootstrap(document, ['slider-admin']);
    });
});
