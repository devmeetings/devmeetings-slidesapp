define(['angular',
        '_',
        'xplatform/xplatform-app',
        'xplatform/controllers/dm-xplatform-users/dm-xplatform-users'
        ], function (angular, _, xplatformApp) {
    xplatformApp.controller('dmXplatformTable', ['$scope', '$http', '$q', '$stateParams', '$modal', 'dmUser',
        function ($scope, $http, $q, $stateParams, $modal, dmUser) {
            var type = $stateParams.type;
            $q.all([$http.get('/api/events/' + type), dmUser.getCurrentUser()]).then(function (arr) {
                $scope.events = arr[0].data;
                $scope.user = arr[1];
            });
        
            $scope.slideIsFinished = function (slide, user) {
                return user && !!_.find(slide.peopleFinished, {
                    userId: user.result._id
                });
            };

            $scope.showUsers = function (users) {
                var modalInstance = $modal.open({
                    templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-users/dm-xplatform-users.html',
                    controller: 'dmXplatformUsers',
                    size: 'sm',
                    resolve: {
                        users: function () {
                            return users;       
                        }
                    }
                });
            };
        }
    ]);
});

