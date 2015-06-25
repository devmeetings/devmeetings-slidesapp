define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('trainer.deck', '*', 'trainerdeck-notes', {
      order: 3,
      name: 'Notes',
      description: 'Displays notes for current slide',
      example: {}
    }).directive('trainerdeckNotes', [
        'Sockets',
        function(Sockets) {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    deck: '=context'
                },
                link: function(scope) {
                    scope.followUser = false;

                    function refreshNotes() {
                        if (!scope.followUser) {
                            return;
                        }

                        var getNotes = function() {
                            var currentSlide = _.find(scope.deck.slides, {
                                id: scope.followUser.currentSlide
                            });

                            return (currentSlide && currentSlide.notes) ? currentSlide.notes : 'No notes';
                        };

                        scope.notes = getNotes();
                    }

                    scope.$on('FollowUser:change', function(event, user) {
                        scope.followUser = user;
                        refreshNotes();
                    });

                    Sockets.on('trainer.participants', function(data) {
                        if (!scope.followUser) {
                            return;
                        }

                        var user = _.find(data, {
                            id: scope.followUser.id
                        });
                        scope.$apply(function() {
                            scope.followUser = user || null;
                            refreshNotes();
                        });
                    });
                },
                template: '<div class="trainer-notes" ng-if="followUser.currentSlide"><h2>Current slide notes</h2><pre ng-bind-html="notes"></pre></div>'
            };
        }
    ]);
});
