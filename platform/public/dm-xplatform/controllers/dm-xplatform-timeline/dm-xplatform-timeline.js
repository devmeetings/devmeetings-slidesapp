define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformTimeline', ['$scope', function ($scope) {
    
       
        
        
        
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

