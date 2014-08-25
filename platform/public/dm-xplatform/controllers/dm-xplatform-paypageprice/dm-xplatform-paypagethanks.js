define(['angular', 'xplatform/xplatform-app', 'xplatform/courses'], function(angular, xplatformApp) {
    xplatformApp.controller('dmXplatformPaypagethanks', ['$scope', '$stateParams', '$http',
        function($scope, $stateParams, $http) {
            if (!$stateParams.id) {
                return;
            }
            $http.post('/api/payments/' + $stateParams.id + '/' + $stateParams.price + '/' + $stateParams.subscription);
        }
    ]);
});
