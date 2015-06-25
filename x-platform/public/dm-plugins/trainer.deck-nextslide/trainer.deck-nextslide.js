define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('trainer.deck', '*', 'trainerdeck-nextslide', {
      order: 2,
      name: 'Next Slide',
      description: 'Allows Trainer to switch to Next Slide on Followed User',
      example: {}
    }).directive('trainerdeckNextslide', [
        'Sockets',
        function(Sockets) {

            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    deck: '=context'
                },
                templateUrl: path + '/trainer.deck-nextslide.html',
                link: function(scope) {
                    scope.followUser = null;

                    function getNextSlideId(slideId) {
                        var currentSlidePosition = scope.deck.slides.indexOf(slideId);
                        return scope.deck.slides[(++currentSlidePosition % scope.deck.slides.length)];
                    }

                    scope.$on('FollowUser:change', function(event, user) {
                        scope.followUser = user;
                    });

                    scope.getSlidePath = function() {
                        var slideId = getNextSlideId(scope.followUser.currentSlide);
                        return '/slides/' + slideId;
                    };

                    Sockets.on('trainer.participants', function(data) {
                        if (!scope.followUser) {
                            return;
                        }

                        var user = _.find(data, {
                            id: scope.followUser.id
                        });
                        scope.$apply(function() {
                            scope.followUser = user || null;
                        });
                    });
                }
            };
        }
    ]);
});
