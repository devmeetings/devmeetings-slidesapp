define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformAnnos', ['$scope', '$stateParams', '$state', 'dmEvents', function ($scope, $stateParams, $state, dmEvents) {
                
        dmEvents.getEvent($stateParams.event, false).then(function (data) {
            //TODO move this below to service
            var material = _.find(data.iterations[$stateParams.iteration].materials, function (elem) {
                return elem._id === $stateParams.material;
            });

            $scope.annotations = material.annotations;
        });

        $scope.state = dmEvents.getState($stateParams.event, $stateParams.material);       

    }]);
});

