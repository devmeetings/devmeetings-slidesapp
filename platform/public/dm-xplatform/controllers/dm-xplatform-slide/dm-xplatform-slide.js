define(['angular', 'xplatform/xplatform-app',
        'directives/plugins-loader'
        ], function (angular, xplatformApp, pluginsLoader) {
    xplatformApp.controller('dmXplatformSlide', ['$scope', '$stateParams', '$state', '$http', 'dmUser', function ($scope, $stateParams, $state, $http, dmUser) {
        $http.get('/api/slides/' + $stateParams.id).success(function (slide) {
            $scope.slide = slide;
        });
    }]);
});
