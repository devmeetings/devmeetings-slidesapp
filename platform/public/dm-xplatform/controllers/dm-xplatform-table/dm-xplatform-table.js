define(['angular', '_', 'xplatform/xplatform-app'], function (angular, _, xplatformApp) {
    xplatformApp.controller('dmXplatformTable', ['$scope', '$http', '$q', '$stateParams', 'User',
        function ($scope, $http, $q, $stateParams, User) {
            var type = $stateParams.type;
            $q.all([$http.get('/api/events/' + type), User.currentUser()]).then(function (arr) {
                $scope.events = arr[0].data;
                $scope.user = arr[1];
            });

            $scope.isRegistered = function (event) {
                return _.contains(_.pluck(event.people, 'mail'), $scope.user.email);
            };

            $scope.register = function (event) {
                if ($scope.isRegistered(event)) {
                    return;
                }

                event.people.push({
                    userId: $scope.user._id,
                    mail: $scope.user.email
                });
            };

        }
    ]);
});
