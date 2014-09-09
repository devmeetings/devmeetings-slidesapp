define(['angular', 
        '_',
        'xplatform/xplatform-app',
        'directives/plugins-loader',
        //'xplatform/directives/dm-microtask-users/dm-microtask-users',
        //'xplatform/directives/dm-microtask-done/dm-microtask-done',
        'xplatform/services/dm-tasks/dm-tasks'
        ], function (angular, _, xplatformApp, pluginsLoader) {
    xplatformApp.controller('dmXplatformSlide', ['$scope', '$q', '$stateParams', '$state', '$http', '$timeout', 'dmUser', 'dmTasks', function ($scope, $q, $stateParams, $state, $http, $timeout, dmUser, dmTasks) {

        var allPromise = $http.get('/api/slidesaves');
        var currentPromise = $http.get('/api/slidesaves/' + $stateParams.slide);

        $q.all([allPromise, currentPromise]).then(function (results) {
            $scope.saves = results[0].data.map(function (save) {
                save.timestamp = new Date(save.timestamp);
                return save;
            });
            $scope.slide = results[1].data;
        });

        $scope.deleteSave = function (save) {
            $http.delete('/api/slidesaves/' + save._id).then(function () {
                _.remove($scope.saves, function (elem) {
                    return elem._id === save._id;
                });
            })
        };

        $scope.saveSlide = function () {
            var save = {
                slide: angular.copy($scope.slide.slide),
                timestamp: new Date(),
                title: $scope.saveTitle
            };

            $http.post('/api/slidesaves', save).success(function (slidesave) {
                save._id = slidesave.slidesave;
                $scope.saves.push(save);
            });
            $http.saveTitle = '';
        };

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

