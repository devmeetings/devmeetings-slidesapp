define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformLive', ['$scope', '$http',
        function ($scope, $http) {
            $http.get('/api/events').success(function (events) {
                $scope.events = events;
            });
        }
    ]);
});

