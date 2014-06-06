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
                controller: ['$scope', '$rootScope', function($scope, $rootScope){
                    $scope.followUserId = null;

                    $scope.follow = function(userId){
                        $scope.followUserId = userId;
                        $rootScope.$broadcast('FollowUser:change', _.find($scope.users, {id: $scope.followUserId}));
                    };

                    $scope.goToNextSlide = function(){
                        var user =  _.find($scope.users, {id: $scope.followUserId});
                        Sockets.emit('trainer.follow.nextSlide', {user: user});
                    };

                    $scope.goToPrevSlide = function(){
                        var user =  _.find($scope.users, {id: $scope.followUserId});
                    };
                }],
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