define(['angular',
        'xplatform/xplatform-app'
], function (angular, xplatformApp) {   
    xplatformApp.controller('dmXplatformPlayer', ['$scope', '$timeout', '$state', '$stateParams', 'dmTrainings',
        function ($scope, $timeout, $state, $stateParams, dmTrainings) {

            $scope.state = {
                isPlaying: true, 
                currentSecond: 0,
                length: 0,              // slide should and when is currentSecond + length
                chapterId: undefined,
                onLeftButtonPressed: undefined,
                onRightButtonPressed: undefined,
                onSaveFile: undefined,
                onOpenFile: undefined
            };

            var trainingId = $stateParams.id;
            dmTrainings.getTrainingWithId(trainingId).then( function (training) {
                $scope.training = training;
                //$scope.navbar.title = 'Podstawy JavaScript';// training.title;
                $scope.navbar.showTitle = true;
            });
            
            $scope.goToChapter = function (index) {
                //$scope.state.isPlaying = false;
                
                //$timeout

                $state.go('navbar.player.chapter', {index: index});
            };
            
        }
    ]);
});

