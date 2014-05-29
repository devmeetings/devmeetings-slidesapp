define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('trainer', 'notes', 'trainer-notes', 2).directive('trainerNotes', [
        'Sockets',
        function(Sockets) {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                },
                link: function(scope){
                    scope.followUser = false;
                    function refreshNote(){
                        scope.notes = scope.slide.notes || 'No notes';
                    }

                    scope.$on('FollowUser:change', function(event, user){
                        scope.followUser = user;
                        refreshNote();
                    });

                    Sockets.on('trainer.participants', function(data) {
                        var user;
                        if(scope.followUser)
                        {
                            user = _.find(data, {id: scope.followUser.id});
                            scope.$apply(function() {
                                scope.followUser = (user) ? user : false;
                                refreshNote();
                            });
                        }
                    });
                },
                template: '<div class="trainer-notes" ng-if="followUser"><h2>Current slide notes</h2><pre ng-bind-html="notes"></pre></div>'
            };
        }
    ]);
});