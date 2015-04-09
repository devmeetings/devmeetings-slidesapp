define(['angular', 'xplatform/xplatform-app', 'slider/slider.plugins',
        'xplatform/services/dm-tasks/dm-tasks'], function (angular, xplatformApp, sliderPlugins) {
    sliderPlugins.registerPlugin('microtask', '*', 'microtask-users', 500).directive('microtaskUsers', [
        '$modal', 'dmTasks', function ($modal, dmTasks) {
            return {
                restrict: 'E',
                scope: {
                    microtask: '=context'
                },
                templateUrl: '/static/dm-xplatform/directives/dm-microtask-users/dm-microtask-users.html',
                link: function (scope, element) {

                    scope.showUsers = function (users) {
                    
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
            
                    dmTasks.getEventWithSlide().then(function (event) {
                        var result = _.find(event.slides, function (task) {
                            return task.task === scope.microtask.taskName;
                        });

                        scope.people = result.peopleFinished;
                    });
                }
            };
        }
    ]);
});

