/* globals define */
define(['require', 'slider/slider.plugins'], function (require, sliderPlugins) {
  sliderPlugins.factory('DeckAndSlides', ['$q', '$rootScope',
    function ($q, $rootScope) {
      /* TODO [ToDr] Rethink and merge CurrentSlideManagerForDeck & DeckAndSlides ? */
      var asPromise = function (path) {
        var result = $q.defer();
        require([path], function (promiseResult) {
          result.resolve(promiseResult);
        });
        return result.promise;
      };

      return {
        deckId: (typeof slides === 'undefined') ? null : slides,
        slideId: (typeof slideId === 'undefined') ? null : slideId,
        // TODO [ToDr] Fix this when plugins loading is splitted2
        isDeckContext: function () {
          return this.deckId !== null;
        },
        _deck: function () {
          function findSlideIdx (slides, id, defaultIdx) {
            var idx = slides.map(function (slide) {
              return slide._id;
            }).indexOf(id);
            return idx === -1 ? defaultIdx : idx;
          }

          return {
            deckId: slides,
            deck: asPromise('require/decks/' + slides),
            slides: asPromise('require/decks/' + slides + '/slides').then(function (slides) {
              var from = findSlideIdx(slides, $rootScope.from, 0);
              var to = findSlideIdx(slides, $rootScope.to, slides.length);
              return slides.slice(from, to);
            })
          };
        },
        _slide: function () {
          return {
            deckId: this.deckId,
            slideId: slideId,
            slide: asPromise('require/slides/' + slideId)
          };
        },
        inContextOf: function (context) {
          if (context === 'deck') {
            return this._deck();
          }

          if (context === 'slide') {
            return this._slide();
          }
        }
      };
    }
  ]);
});
