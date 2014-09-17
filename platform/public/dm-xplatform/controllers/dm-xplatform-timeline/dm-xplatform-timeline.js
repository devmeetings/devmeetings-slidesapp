define(['angular', 'xplatform/xplatform-app',
        'xplatform/services/dm-events/dm-events'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformTimeline', ['$scope', '$stateParams', 'dmEvents', function ($scope, $stateParams, dmEvents) {
    
        dmEvents.getEvent($stateParams.event, false).then(function (data) {
            $scope.audio = data.audio;
        });

        $scope.state = dmEvents.getState();
        
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

