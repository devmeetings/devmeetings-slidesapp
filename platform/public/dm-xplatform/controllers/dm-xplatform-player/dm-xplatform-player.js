define(['angular',
        'xplatform/xplatform-app'
], function (angular, xplatformApp) {   
    xplatformApp.controller('dmXplatformPlayer', ['$scope', '$stateParams', 'dmTrainings',
        function ($scope, $stateParams, dmTrainings) {

            $scope.state = {
                isPlaying: true, 
                currentSecond: 0,
                length: 0,              // slide should and when is currentSecond + length
                onLeftButtonPressed: undefined,
                onRightButtonPressed: undefined,
                onSaveFile: undefined
            };

            var trainingId = $stateParams.id;
            dmTrainings.getTrainingWithId(trainingId).then( function (training) {
                $scope.training = training;
                $scope.navbar.title = 'Podstawy JavaScript';// training.title;
                $scope.navbar.showTitle = true;
            });

            
        }
    ]);
});

