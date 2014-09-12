define(['angular',
        '_',
        'xplatform/xplatform-app',
        'xplatform/controllers/dm-xplatform-users/dm-xplatform-users',
        'xplatform/courses'
        ], function (angular, _, xplatformApp) {
    xplatformApp.controller('dmXplatformTable', ['$scope', '$http', '$state', '$q', '$stateParams', '$modal', 'dmUser', 'Courses',
        function ($scope, $http, $state, $q, $stateParams, $modal, dmUser, Courses) {
            
            $scope.visibilityChanged = function (event) {
                $http.post('/api/change_event_visibility/' + event._id + '/' + event.visible);
            };

            var type = $stateParams.type;
           
            $scope.course = Courses.getCourseById(type);
            
            $http.get('/api/events/' + type).success(function (events) {
                $scope.events = events;
            });

            $http.get('/api/slidesaves').success(function (slidesaves) {
                $scope.slidesaves = slidesaves;
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
                if (!$scope.user) {
                    $state.go('index.login'); 
                    return;
                }
            
                var basic = $scope.course && $scope.course.basicWorkspace ? $scope.course.basicWorkspace : '540594775abf354c52c8fd7a';

                $http.post('/api/slidesave_from_slide/' + basic).success(function (data) {
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

