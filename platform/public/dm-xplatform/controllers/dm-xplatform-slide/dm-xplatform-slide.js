define(['angular', 
        '_',
        'xplatform/xplatform-app',
        'directives/plugins-loader',
        ], function (angular, _, xplatformApp, pluginsLoader) {

    xplatformApp.controller('dmXplatformSlide', ['$scope', '$q', '$stateParams', '$http', function ($scope, $q, $stateParams, $http) {

        $scope.slideId = $stateParams.slide;

        var allPromise = $http.get('/api/slidesaves');
        var currentPromise = $http.get('/api/slidesaves/' + $stateParams.slide);

        $q.all([allPromise, currentPromise]).then(function (results) {
            $scope.saves = results[0].data.map(function (save) {
                save.timestamp = new Date(save.timestamp);
                return save;
            });
            $scope.slide = results[1].data;
            $scope.userSlide = $scope.saves.filter(function (save) {
                return $scope.slide._id === save._id;
            }).length > 0;
        });

        var sendWithDebounce = _.debounce(function (slide) {
            $http.put('/api/slidesaves/' + slide._id, slide);
        }, 200);

        $scope.$watch('slide', function () {
            if ($scope.slide) {
                sendWithDebounce($scope.slide); 
            }
        }, true);
    }]);
});

