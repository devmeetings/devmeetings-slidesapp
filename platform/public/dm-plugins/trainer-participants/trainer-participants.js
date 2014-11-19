define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('trainer', '*', 'trainer-participants', 1).directive('trainerParticipants', [
        'Sockets', '$rootScope',
        function(Sockets, $rootScope) {

            return {
                restrict: 'E',
                scope: {
                    notes: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/trainer-participants.html',
                controller: ['$scope', '$rootScope',
                    function($scope, $rootScope) {
                        $scope.followUserId = null;

                        $scope.follow = function(userId) {
                            var user;
                            if ($scope.followUserId === userId) {
                                // unfollow
                                userId = null;
                                user = null;
                            } else {
                                user = _.find($scope.users, {
                                    id: userId
                                });
                            }

                            $scope.followUserId = userId;
                            $rootScope.$broadcast('FollowUser:change', user);
                        };

                        $scope.goToNextSlide = function() {
                            var user = _.find($scope.users, {
                                id: $scope.followUserId
                            });
                            Sockets.emit('trainer.follow.nextSlide', {
                                user: user
                            });
                        };

                        $scope.goToPrevSlide = function() {
                            var user = _.find($scope.users, {
                                id: $scope.followUserId
                            });
                            Sockets.emit('trainer.follow.prevSlide', {
                                user: user
                            });
                        };
                    }
                ],
                link: function(scope) {
                    Sockets.emit('trainer.register', {}, function(data) {
                        $rootScope.$apply(function() {
                            $rootScope.isAuthorized = data.isAuthorized;
                        });
                    });

                    Sockets.on('trainer.participants', function(data) {
                        scope.$apply(function() {
                            scope.users = data;
                        });
                    });
                }
            };
        }
    ]);
});
