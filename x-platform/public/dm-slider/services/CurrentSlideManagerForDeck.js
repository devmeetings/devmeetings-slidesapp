define(['slider/slider.plugins', 'services/DeckAndSlides'], function (sliderPlugins) {
  sliderPlugins.factory('CurrentSlideManagerForDeck', ['$rootScope', '$location', 'Sockets', 'DeckAndSlides',
    function ($rootScope, $location, Sockets, DeckAndSlides) {
      /* TODO [ToDr] Rethink and merge CurrentSlide & CurrentSlideManager & DeckAndSlides */
      var csm = {
        activeSlideId: 0
      };

      // TODO [ToDr] OMG this is serious issue with loading all the plugins at once.
      if (!DeckAndSlides.isDeckContext()) {
        return csm;
      }

      DeckAndSlides.inContextOf('deck').deck.then(function (deck) {
        if (!csm.activeSlideId) {
          csm.activeSlideId = deck.slides[0];
        }
      });

      sliderPlugins.forwardEventToServer('slide.current.change', Sockets);

      var updateCurrentSlide = function () {
        var slideId = $location.url().substr(1);
        if (slideId !== '') {
          var previousSlideId = csm.activeSlideId;
          csm.activeSlideId = slideId;
          sliderPlugins.trigger('slide.current.change', csm.activeSlideId, previousSlideId);
        }
      };
      $rootScope.$on('$locationChangeSuccess', updateCurrentSlide);
      updateCurrentSlide();

      return csm;
    }
  ]);
});
