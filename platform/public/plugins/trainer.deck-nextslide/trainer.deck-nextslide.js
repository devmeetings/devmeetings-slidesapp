define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('trainer.deck', '*', 'trainerdeck-nextslide', 3).directive('trainerdeckNextslide', [
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
                    scope.followUser = false;

                    function getNextSlideId(slideId){
                        var currentSlidePosition = _.findIndex(scope.deck.slides, {id: slideId});
                        return scope.deck.slides[(++currentSlidePosition % scope.deck.slides.length)].id;
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