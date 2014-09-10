define(['angular', 
        '_',
        'xplatform/xplatform-app',
        'directives/plugins-loader',
        'xplatform/services/dm-tasks/dm-tasks'
        ], function (angular, _, xplatformApp, pluginsLoader) {

    xplatformApp.directive('dmXplatformChat', [function () {
        
        return {
            restrict: 'E',
            scope: {
                name: '@'       
            },
            replace: true,
            template: '<iframe class="dm-chat-iframe"></iframe>',
            link: function (scope, element) {
            
                scope.$watch('name', function () {
                    if (!scope.name) {
                        return;
                    }

                    var name = encodeURI(scope.name.replace(/ /g, ''));
                    element[0].src = 'http://0.0.0.0:9000/#/?autologin=true&host=irc.freenode.org&port=6667&nick=' + name + '&realname=' + name + '&join=#shout-irc';
                });
            }
        }
    }]);

    xplatformApp.controller('dmXplatformSlide', ['$scope', '$q', '$stateParams', '$state', '$http', '$timeout', 'dmUser', 'dmTasks', function ($scope, $q, $stateParams, $state, $http, $timeout, dmUser, dmTasks) {

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

        $scope.deleteSave = function (save, $event) {
            $event.stopPropagation();
            $http.delete('/api/slidesaves/' + save._id).then(function () {
                _.remove($scope.saves, function (elem) {
                    return elem._id === save._id;
                });
            })
        };

        dmUser.getCurrentUser().then(function (user) {
            $scope.user = user;
        });


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

