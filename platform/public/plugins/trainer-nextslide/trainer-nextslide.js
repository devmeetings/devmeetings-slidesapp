define(['decks/' + slides, 'module', 'slider/slider.plugins'], function(deck, module, sliderPlugins) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('trainer', '*', 'trainer-nextslide', 3).directive('trainerNextslide', [
        'Sockets',
        function(Sockets) {

            return {
                restrict: 'E',
                scope: {
                    notes: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/trainer-nextslide.html',
                link: function(scope) {
                    scope.followUser = false;

                    function getNextSlideId(slideId){
                        var currentSlidePosition = _.findIndex(deck.slides, {id: slideId});
                        return deck.slides[(++currentSlidePosition % deck.slides.length)].id;
                    }

                    scope.$on('FollowUser:change', function(event, user){
                        scope.followUser = user;
                    });

                    scope.getSlidePath = function(){
                        var slideId = getNextSlideId(scope.followUser.currentSlide);
                        return '/slides/' + scope.followUser.deck + '/slide-' + slideId;
                    };

                    Sockets.on('trainer.participants', function(data) {
                        if(scope.followUser)
                        {
                            var user = _.find(data, {id: scope.followUser.id});
                            scope.$apply(function() {
                                scope.followUser = (user) ? user : false;
                            });
                        }
                    });
                }
            };
        }
    ]);
});