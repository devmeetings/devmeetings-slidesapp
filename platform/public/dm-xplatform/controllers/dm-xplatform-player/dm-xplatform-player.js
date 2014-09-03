define(['angular',
        'xplatform/xplatform-app',
        'xplatform/directives/dm-timeline/dm-timeline'
], function (angular, xplatformApp) {   
    xplatformApp.controller('dmXplatformPlayer', ['$scope', '$timeout', '$state', '$stateParams', 'dmTrainings',
        function ($scope, $timeout, $state, $stateParams, dmTrainings) {


            $scope.state = {
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
            dmTrainings.getTrainingWithId(trainingId).then( function (training) {
                $scope.training = training;
                //$scope.navbar.title = 'Podstawy JavaScript';// training.title;
                //$scope.navbar.showTitle = true;
            });
            
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

