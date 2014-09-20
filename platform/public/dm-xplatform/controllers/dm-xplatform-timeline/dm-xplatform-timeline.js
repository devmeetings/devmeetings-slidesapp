define(['angular', 'xplatform/xplatform-app', '_',
        'xplatform/services/dm-events/dm-events',
        'xplatform/directives/dm-timeline/dm-timeline'], function (angular, xplatformApp, _) {
    xplatformApp.controller('dmXplatformTimeline', ['$scope', '$stateParams', 'dmEvents', function ($scope, $stateParams, dmEvents) {
    
        dmEvents.getEvent($stateParams.event, false).then(function (data) {
            //TODO move this below to service
            var material = _.find(data.iterations[$stateParams.iteration].materials, function (elem) {
                return elem._id === $stateParams.material;
            });

            $scope.audio = material.url;
            $scope.annotations = material.annotations;
        });

        $scope.state = dmEvents.getState($stateParams.event, $stateParams.material);       
        
        $scope.$on('$destroy', function () {
            // next time we will be here, just continue
            $scope.state.startSecond = $scope.state.currentSecond; 
        });

        
        var rates = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
        $scope.state.playbackRate = rates[0];
        $scope.changeRate = function() {
            var nextRate = rates.indexOf($scope.state.playbackRate) + 1;
            nextRate = nextRate % rates.length;
            $scope.nextRate = rates[(nextRate + 1) % rates.length];
            $scope.state.playbackRate = rates[nextRate];
        };
        $scope.changeRate();

    }]);
});

