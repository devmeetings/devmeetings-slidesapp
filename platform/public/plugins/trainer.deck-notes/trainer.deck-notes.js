define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('trainer.deck', '*', 'trainerdeck-notes', 1).directive('trainerdeckNotes', [
        'Sockets',
        function(Sockets) {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    deck: '=context'
                },
                link: function(scope){
                    scope.followUser = false;

                    function refreshNotes(){
                        var currentSlide = _.find(scope.deck.slides, {id: scope.followUser.currentSlide});
                        scope.notes = (currentSlide && currentSlide.notes) ? currentSlide.notes : 'No notes';
                    }

                    scope.$on('FollowUser:change', function(event, user){
                        scope.followUser = user;
                        refreshNotes();
                    });

                    scope.$on('FollowUser:stopFollow', function(){
                        scope.followUser = false;
                    });


                    Sockets.on('trainer.participants', function(data) {
                        var user;
                        if(scope.followUser)
                        {
                            user = _.find(data, {id: scope.followUser.id});
                            scope.$apply(function() {
                                scope.followUser = (user) ? user : false;
                                refreshNotes();
                            });
                        }
                    });
                },
                template: '<div class="trainer-notes" ng-if="followUser.currentSlide"><h2>Current slide notes</h2><pre ng-bind-html="notes"></pre></div>'
            };
        }
    ]);
});