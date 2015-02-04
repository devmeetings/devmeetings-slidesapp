define(['angular',
        'xplatform/xplatform-app',
    '_',
], function(angular, xplatformApp,  _) {
    xplatformApp.controller('dmXplatformUpload', ['$scope', 'event', 'iteration', function($scope, event, iteration) {
        $scope.event = event;
        $scope.iteration = iteration;
        $('#dmUpload').ajaxComplete(function () {
            
        });
    }]);
});

