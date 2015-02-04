define(['_', 'lz-string', 'slider/slider.plugins', 'services/DeckAndSlides'], function(_, lzString, sliderPlugins, Sockets, DeckAndSlides) {
    sliderPlugins.factory('SlideLiveSave', ['Sockets', 'DeckAndSlides',
        function(Sockets, DeckAndSlides) {

            var SEND_FREQ = 3000;
            var buffer = [];

            var send = _.throttle(function() {
                var data = lzString.compressToBase64(JSON.stringify(buffer));

                Sockets.emit('slide.code.save', {
                    data: data,
                    timestamp: Date.now(),
                    deckId: DeckAndSlides.deckId,
                    slideId: DeckAndSlides.slideId
                });
                buffer = [];
            }, SEND_FREQ, {
                leading: false,
                trailing: true
            });

            var SlideLiveSave = {
                save: function(code) {
                    buffer.push({
                        timestamp: Date.now(),
                        code: angular.copy(code)
                    });
                    send();
                }
            };
            return SlideLiveSave;
        }
    ]);
});
