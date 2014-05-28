define(['decks/' + slides, 'module', 'slider/slider.plugins'], function(deck, module, sliderPlugins) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('trainer', 'notes', 'trainer-notes').directive('trainerNotes', [
        'Sockets',
        function(Sockets) {
            return {
                restrict: 'E',
                scope: {
                    notes: '=data',
                    slide: '=context'
                },
                link: function(scope){
                    scope.followUser = false;
                    function bindNote(slideId){
                        var currentSlide = _.find(deck.slides, {id: slideId});
                        scope.notes = currentSlide.notes || 'Notes are empty';
                    }


                    scope.$on('FollowUser:change', function(event, user){
                        scope.followUser = user;
                        if(user.currentSlide)
                        {
                            bindNote(user.currentSlide);
                        }
                    });

                    Sockets.on('trainer.participants', function(data) {
                        if(scope.followUser)
                        {
                            var user = _.find(data, {id: scope.followUser.id});
                            scope.$apply(function() {
                                scope.followUser = (user) ? user : false;
                                bindNote(user.currentSlide);
                            });
                        }
                    });
                },
                template: '<div ng-if="followUser"><h2>Current slide notes</h2><pre ng-bind-html="notes"></pre></div>'
            };
        }
    ]);
});