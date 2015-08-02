/* globals define */
define(['require', 'angular', '_', 'angular-ui-sortable', 'angular-ui-router', './slider-admin.html!text'], function (require, angular, _, angularSortable, angularRouter, viewTemplate) {
  var module = angular.module('slider.admin', ['ui.sortable', 'ui.router']);

  module.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('index.decks', {
      url: '/decks',
      views: {
        content: {
          template: viewTemplate,
          controller: 'AdminSlidesListCtrl'
        }
      }
    });
  }]);

  module.controller('AdminSlidesListCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.deckSlidesSearch = '';
    $scope.allSlidesSearch = '';

    var fetchDecks = function () {
      $http.get('/api/decks').then(function (data) {
        $scope.decks = data.data;
      });
    };
    fetchDecks();

    var fetchSlides = function () {
      $http.get('/api/slides').success(function (data, status) {
        $scope.slides = data;
      });
    };
    fetchSlides();

    $scope.removeSlide = function (slides, slide) {
      var index = _.pluck(slides, '_id').indexOf(slide._id);
      slides.splice(index, 1);
    // TODO send put to API
    };

    $scope.addSlideToDeck = function (deck, slides, slide) {
      if (_.contains(deck.slides, slide._id)) {
        return;
      }
      deck.slides.push(slide._id);
      slides.push(slide);
      $http.put('/api/decks/' + deck._id, deck);
    };

    $scope.selectDeck = function (deck) {
      $scope.selected = deck;
      $scope.selectedSlides = [];
      $http.get('/api/require/decks/' + deck._id + '/slides').then(function (slides) {
        $scope.selectedSlides = slides.data;
      });
    };

    $scope.orderUpdated = {
      stop: function (em, ui) {
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
      $http.delete('/api/decks/' + id).then(fetchDecks);
    };

    $scope.addDeck = function () {
      var title = $scope.deckTitle;
      $scope.deckTitle = '';

      $http.post('/api/decks', {
        title: title
      }).then(fetchDecks);
    };

    $scope.addExemplaryDeck = function () {
      require([require.toUrl('./exemplary-deck/data-slides.js'), require.toUrl('./exemplary-deck/data-deck.js')], function (slides, deck) {
        $http.post('/api/slides', slides).success(function (data, status) {
          deck.slides = data;
          $http.post('/api/decks', deck).then(function () {
            $scope.decks.push(deck);
          });
        });
      });
    };
  }]);
});
