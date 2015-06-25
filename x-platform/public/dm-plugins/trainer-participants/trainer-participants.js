/* globals define */
define(['_', 'slider/slider.plugins', './trainer-participants.html!text'], function (_, sliderPlugins, viewTemplate) {
  sliderPlugins.registerPlugin('trainer', '*', 'trainer-participants', {
    order: 1,
    name: 'Participants',
    description: 'Displays all users that are currently on the same deck',
    example: {}
  }).directive('trainerParticipants', [
    'Sockets', '$rootScope',
    function (Sockets, $rootScope) {
      return {
        restrict: 'E',
        scope: {
          notes: '=data',
          slide: '=context'
        },
        template: viewTemplate,
        controller: ['$scope', '$rootScope',
          function ($scope, $rootScope) {
            $scope.followUserId = null;

            $scope.follow = function (userId) {
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

            $scope.goToNextSlide = function () {
              var user = _.find($scope.users, {
                id: $scope.followUserId
              });
              Sockets.emit('trainer.follow.nextSlide', {
                user: user
              });
            };

            $scope.goToPrevSlide = function () {
              var user = _.find($scope.users, {
                id: $scope.followUserId
              });
              Sockets.emit('trainer.follow.prevSlide', {
                user: user
              });
            };
          }
        ],
        link: function (scope) {
          Sockets.emit('trainer.register', {}, function (data) {
            $rootScope.$apply(function () {
              $rootScope.isAuthorized = data.isAuthorized;
            });
          });

          Sockets.on('trainer.participants', function (data) {
            scope.$apply(function () {
              scope.users = data;
            });
          });
        }
      };
    }
  ]);
});
