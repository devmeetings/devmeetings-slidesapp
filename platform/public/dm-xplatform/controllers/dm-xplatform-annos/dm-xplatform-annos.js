define(['angular', 'xplatform/xplatform-app', 'xplatform/directives/dm-annotation/dm-annotation'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformAnnos', ['$scope', '$stateParams', '$state', 'dmEvents', function ($scope, $stateParams, $state, dmEvents) {
               

        var getSpecific = function () {
            dmEvents.getEventMaterial($stateParams.event, $stateParams.iteration, $stateParams.material).then(function (material) {
                $scope.annotations = material.annotations; 
            });
        };

        var getAll = function () {
            dmEvents.getAllAnnotations($stateParams.event).then(function (annotations) {
                $scope.annotations = annotations; 
            });
        };


        $scope.showAll = $state.current.name !== 'index.space.player';
        if ($scope.showAll) {
            getAll();
        } else {
            getSpecific();
        }

        $scope.state = dmEvents.getState($stateParams.event, $stateParams.material);       
        $scope.showSearch = true;
        $scope.search = {
            text: ''
        };

    }]);
});

