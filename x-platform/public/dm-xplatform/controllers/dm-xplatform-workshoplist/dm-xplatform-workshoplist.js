define(['angular', 'xplatform/xplatform-app', '_'], function(angular, xplatformApp, _) {
    xplatformApp.controller('dmXplatformWorkshoplist', ['$scope', '$stateParams', 'dmEvents',
        function($scope, $stateParams, dmEvents) {
        
            dmEvents.allEvents().then(function (events) {
                $scope.courses = events; 
            });

            $scope.visibilityChanged = function (event) {
                dmEvents.changeEventVisibility(event._id, event.visible); 
            };

            $scope.remove = function (event) {
                dmEvents.removeEvent(event._id).then(function () {
                    _.remove($scope.courses, function (c) {
                        return c._id === event._id;
                    });
                });
            };

            $scope.create = function () {
                dmEvents.createEvent({
                    title: "new event"
                }).then(function (event) {
                    $scope.courses.push(event);
                });
            };
        }
    ]);
});

