define(['angular', 'xplatform/xplatform-app'], function(angular, xplatformApp) {
    xplatformApp.controller('dmXplatformWorkshoplist', ['$scope', '$stateParams', 'dmEvents',
        function($scope, $stateParams, dmEvents) {
        
            dmEvents.allEvents().then(function (events) {
                $scope.courses = events; 
            });

            $scope.visibilityChanged = function (event) {
                dmEvents.changeEventVisibility(event._id, event.visible); 
            };

        }
    ]);
});

