define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('trainer', '*', 'trainer-nextslide', 1).directive('trainerNextslide', [
        'Sockets', '$rootScope',
        function(Sockets, $rootScope) {

            return {
                restrict: 'E',
                scope: {
                    notes: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/trainer-nextslide.html',
                controller: ['$scope', '$rootScope', function($scope){
                    console.log($scope.notes, $scope.context);

                    $scope.followUser = false;
                    $scope.$on('FollowUser:change', function(event, user){
                        $scope.followUser = user;
                    });

                    $scope.getSlidePath = function(){
                        return '/slides/' + $scope.followUser.deck + '/slide-' + $scope.followUser.currentSlide;
                    }

                    // TODO: get next slide
                }],
                link: function(scope) {
                    Sockets.on('trainer.participants', function(data) {
                        if(scope.followUser)
                        {
                            var user = _.find(data, {id: scope.followUser.id});
                            scope.$apply(function() {
                                if(user)
                                {
                                    scope.followUser = user;
                                }
                                else
                                {
                                    scope.followUser = false;
                                }
                            });
                        }
                    });
                }
            };
        }
    ]);
});