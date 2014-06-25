define(['_', 'lz-string', 'slider/slider.plugins', 'services/Sockets', 'services/DeckAndSlides'], function (_, lzString, sliderPlugins, Sockets, DeckAndSlides) {
    sliderPlugins.factory('SlideLiveSave', ['Sockets', 'DeckAndSlides',
        function (Sockets, DeckAndSlides) {
            
            var SEND_FREQ = 3000;
            var buffer = [];

            var send = _.throttle( function () {
                Sockets.emit('slide.code.save', {
                    data: buffer,
                    timestamp: Date.now(),
                    deckId: DeckAndSlides.deckId,
                    slideId: DeckAndSlides.slideId
                });
                buffer = [];
            }, SEND_FREQ);

            var SlideLiveSave = {
                save: function (code) {
                    buffer.push({
                        timestamp: Date.now(),
                        code: lzString.compress(code)
                    });
                    send();
                }
            };

            return SlideLiveSave;
        }
    ]);
});

