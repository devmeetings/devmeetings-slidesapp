define(['module', 'slider/slider.plugins', 'services/Sockets', 'services/DeckAndSlides'], function(module, sliderPlugins) {
    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('slide', 'commit', 'slide-commit', 10000).directive('slideCommit', [
        'Sockets', 'DeckAndSlides', '$window',
        function(Sockets, DeckAndSlides, $window) {

            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-commit.html',
                link: function(scope, element) {
                    scope.committing = false;
                    scope.commitMessage = "";

                    scope.commit = function() {
                        scope.committing = true;

                        Sockets.emit('slide.commit', {
                            deckId: DeckAndSlides.deckId,
                            parentId: DeckAndSlides.slideId,
                            slideContent: scope.slide,
                            message: scope.commitMessage
                        }, function(data) {

                            scope.$apply(function() {
                                scope.commitMessage = "";
                                scope.committing = false;

                                // TODO [ToDr] Not sure if this should happen?
                                // $window.location = '/slides/' + data.data;
                            });
                        });
                    };
                }
            };
        }
    ]);

});