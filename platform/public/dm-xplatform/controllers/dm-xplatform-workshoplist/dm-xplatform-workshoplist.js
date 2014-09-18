define(['angular', 'xplatform/xplatform-app', 'xplatform/courses'], function(angular, xplatformApp) {
    xplatformApp.controller('dmXplatformWorkshoplist', ['$scope', '$stateParams', 'Courses', 'dmEvents',
        function($scope, $stateParams, Courses, dmEvents) {
        
            dmEvents.allEvents().then(function (events) {
                $scope.courses = events; 
            });

            $scope.visibilityChanged = function (event) {
                dmEvents.changeEventVisibility(event._id, event.visible); 
            };

        }
    ]);
});
