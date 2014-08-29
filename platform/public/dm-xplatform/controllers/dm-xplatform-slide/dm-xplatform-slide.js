define(['angular', 
        'xplatform/xplatform-app',
        'directives/plugins-loader',
        'xplatform/directives/dm-microtask-users/dm-microtask-users',
        'xplatform/directives/dm-microtask-done/dm-microtask-done'
        ], function (angular, xplatformApp, pluginsLoader) {
    xplatformApp.controller('dmXplatformSlide', ['$scope', '$stateParams', '$state', '$http', 'dmUser', function ($scope, $stateParams, $state, $http, dmUser) {
        $http.get('/api/slides/' + $stateParams.id).success(function (slide) {
            $scope.slide = slide;
        });
    }]);
});
