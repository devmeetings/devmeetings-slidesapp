define(['angular',
        '_',
        'xplatform/xplatform-app',
        'xplatform/directives/dm-timeline/dm-timeline',
        'xplatform/directives/dm-snippet/dm-snippet'
], function (angular, _, xplatformApp) {   
    xplatformApp.controller('dmXplatformPlayer', ['$scope', '$timeout', '$state', '$stateParams', '$http', '$q','dmTrainings', 'dmUser',
        function ($scope, $timeout, $state, $stateParams, $http, $q, dmTrainings, dmUser) {


            $scope.state = {
                audioDuration: 0,
                isPlaying: true, 
                currentSecond: 0,
                startSecond: 0,
                videoHeight: 850,
                autoHeight: true,
                length: 0,              // slide should and when is currentSecond + length
                chapterId: undefined,
                onLeftButtonPressed: undefined,
                onRightButtonPressed: undefined,
                onSaveFile: undefined,
                onOpenFile: undefined,
                activeChapterPercentage: 0
            };
            
            $scope.recordingPlayer = {
                //player
                //slide
            };
            
            var element = $('[class*="dm-xplatform-index-left"]').css('background-color', 'rgb(6,6,6)');


            var trainingId = $stateParams.id;

            var buildPoints = function (event) {
                $scope.points = _.map(event.slides, function (task) {
                    return {
                        done: !!_.find(task.peopleFinished, {
                            userId: $scope.user.result._id
                        }),
                        timestamp: task.timestamp,
                        event: $stateParams.event,
                        slide: task.slideId,
                        task: task.task
                    }
                });
                $scope.training = event.trainingId;
            };

            $q.all([dmUser.getCurrentUser(), $http.get('/api/event_with_training/' + $stateParams.event)]).then(function (results) {
                $scope.user = results[0];
                buildPoints(results[1].data);
                $scope.snippets = results[1].data.snippets;
            });

            $scope.pointSelected = function (point) {
                $state.go('index.task', {
                    slide: point.slide,
                    event: point.event
                });
            };
            
            $scope.goToChapter = function (index) {
                $scope.state.isPlaying = false;
                $scope.state.currentSecond = 0;
                
                $timeout(function () {
                    $state.go('index.player.chapter', {index: index});
                }, 500);
            };

            
        }
    ]);
});

