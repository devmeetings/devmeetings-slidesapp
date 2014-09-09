define(['angular',
        '_',
        'xplatform/xplatform-app',
        'xplatform/controllers/dm-xplatform-users/dm-xplatform-users',
        'xplatform/courses'
        ], function (angular, _, xplatformApp) {
    xplatformApp.controller('dmXplatformTable', ['$scope', '$http', '$state', '$q', '$stateParams', '$modal', 'dmUser', 'Courses',
        function ($scope, $http, $state, $q, $stateParams, $modal, dmUser, Courses) {
            
            var type = $stateParams.type;
           
            $scope.course = Courses.getCourseById(type);
            
            $http.get('/api/events/' + type).success(function (events) {
                $scope.events = events;
            });

            dmUser.getCurrentUser().then(function (user) {
                $scope.user = user;
            });

            $scope.slideIsFinished = function (slide, user) {
                return user && !!_.find(slide.peopleFinished, {
                    userId: user.result._id
                });
            };

            $scope.createWorkspace = function () {
                $http.post('/api/slidesave_from_slide/' + $scope.course.basicWorkspace).success(function (data) {
                    $state.go('index.task', {
                        slide: data.slidesave
                    });
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

