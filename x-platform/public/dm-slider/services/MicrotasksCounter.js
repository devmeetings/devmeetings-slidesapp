/* globals define */
define(['slider/slider.plugins', 'services/Sockets'], function (sliderPlugins, Sockets, DeckAndSlides) {
  sliderPlugins.factory('MicrotasksCounter', ['Sockets', 'DeckAndSlides',
    function (Sockets, DeckAndSlides) {
      var MicrotasksCounter = {
        markTaskAsDone: function (hash) {
          // Sockets.emit('microtasks.counter.done', {
          // slideId: DeckAndSlides.slideId,
          // taskHash: hash
          // });
        },
        listen: function (hash, callback) {
          // Sockets.emit('microtasks.counter.watch', {
          // slideId: DeckAndSlides.slideId,
          // taskHash: hash
          // });
          // Sockets.on('microtasks.counter.notify' + hash, callback);
        }
      };

      return MicrotasksCounter;
    }
  ]);
});
