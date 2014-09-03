define(['angular',
        '_',
        'xplatform/xplatform-app',
        'xplatform/directives/dm-timeline/dm-timeline'
], function (angular, _, xplatformApp) {   
    xplatformApp.controller('dmXplatformPlayer', ['$scope', '$timeout', '$state', '$stateParams', '$http', 'dmTrainings',
        function ($scope, $timeout, $state, $stateParams, $http, dmTrainings) {


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

            $http.get('/api/event_with_training/' + $stateParams.event).success(function (event) {
                $scope.points = _.map(event.slides, function (task) {
                    return {
                        done: false,
                        second: task.second
                    }
                });
                $scope.training = event.trainingId;
            });
            
            $scope.pointSelected = function (point) {
            
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

