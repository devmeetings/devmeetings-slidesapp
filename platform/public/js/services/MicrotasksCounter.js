define(['slider/slider.plugins', 'services/Sockets', 'services/DeckAndSlides'], function(sliderPlugins, Sockets, DeckAndSlides) {
    sliderPlugins.factory('MicrotasksCounter', ['Sockets', 'DeckAndSlides',
        function(Sockets, DeckAndSlides) {
            
            var MicrotasksCounter = {
                count: 0,
                markTaskAsDone: function( task ) {
                    Sockets.emit('microtasks.counter.done', {
                        deck: DeckAndSlides.deckId,
                        slide: DeckAndSlides.slideId,
                        task: task.hash 
                    });
                }
            };


            return MicrotaskCounter;
        }
    ]);
});
