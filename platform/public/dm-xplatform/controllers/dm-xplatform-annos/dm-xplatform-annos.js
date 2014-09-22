define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformAnnos', ['$scope', '$stateParams', '$state', 'dmEvents', function ($scope, $stateParams, $state, dmEvents) {
               
        dmEvents.getEventMaterial($stateParams.event, $stateParams.iteration, $stateParams.material).then(function (material) {
            $scope.annotations = material.annotations; 
        });

        $scope.state = dmEvents.getState($stateParams.event, $stateParams.material);       
        $scope.showSearch = true;
        $scope.search = {
            text: ''
        };

    }]);
});

