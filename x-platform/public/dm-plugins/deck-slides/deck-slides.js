/* globals define */
define([
  'module', '_', 'angular', 'FileSaver',
  'slider/slider.plugins', 'services/CurrentSlideManagerForDeck',
  './deck-slides.html!text'
], function (module, _, angular, saveAs, sliderPlugins, SM, viewTemplate) {
  sliderPlugins.registerPlugin('deck', 'slides', 'deck-slides', {
    name: 'Deck Slides',
    description: 'Slides contained in deck',
    example: {
      meta: {
        type: [{
          type: 'SlideObject'
        }]
      },
      data: [{
        name: 'First Slide',
        title: 'Test Title'
      }]
    }
  }).directive('deckSlides',
    function ($timeout, $rootScope, $window, $location, CurrentSlideManagerForDeck, DeckAndSlides) {
      return {
        restrict: 'E',
        scope: {
          slides: '=data',
          deck: '=context',
          recorder: '=recorder'
        },
        template: viewTemplate,

        link: function (scope) {
          var onSlideChange = function onSlideChange (activeSlideId) {
            scope.slide = _.find(scope.deck.deckSlides, {
              _id: activeSlideId
            });
            if (!scope.slide && scope.deck.deckSlides) {
              activateSlide(0);
            }
            if (!scope.deck.deckSlides) {
              $timeout(function () {
                onSlideChange(activeSlideId);
              }, 100);
            }
          };

          function activateSlide (idx) {
            scope.slide = scope.deck.deckSlides[idx];
          }

          scope.modes = $rootScope.modes;
          scope.csm = CurrentSlideManagerForDeck;
          scope.$watch('csm.activeSlideId', onSlideChange);
          scope.$watch('slide._id', function (newId) {
            if (!newId) {
              return;
            }
            $location.url(newId);
            // TODO [ToDr] Shitty as fuck!
            DeckAndSlides.slideId = newId;
          });

          scope.$on('slide', function (ev, slide_content) {
            scope.slide.content = slide_content;
          });

          // function fixSlideIdx (idx, maxLength) {
          //   idx = idx % maxLength;
          //
          //   if (idx >= 0) {
          //     return idx;
          //   }
          //
          //   return maxLength + idx;
          // }

          // function goToSlide (diff) {
          //   var maxLength = scope.deck.deckSlides.length;
          //   var idx = _.map(scope.deck.deckSlides, function (x) {
          //     return x._id;
          //   }).indexOf(scope.slide._id);
          //
          //   idx = fixSlideIdx(idx + diff, maxLength);
          //   activateSlide(idx);
          // }

          // hotkeys.bindTo(scope).add({
          //   combo: 'right',
          //   description: 'Next slide',
          //   callback: goToSlide.bind(null, 1)
          // }).add({
          //   combo: 'left',
          //   description: 'Previous slide',
          //   callback: goToSlide.bind(null, -1)
          // });

          scope.downloadDeck = function () {
            var blob = new window.Blob([angular.toJson(scope.deck)], {
              type: 'application/json;charset=utf-8'
            });
            var now = new Date().toJSON();
            saveAs(blob, scope.deck.title + '-' + now + '.json');
          };
        }
      };
    }
  );
});
