define(['angular',
        'xplatform/xplatform-app'
], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformChapter', ['$scope', '$stateParams', '$http', 'dmTrainings',
        function ($scope, $stateParams, $http, dmTrainings) {
            var trainingId = $stateParams.id;
            var chapterIndex = $stateParams.index;

            dmTrainings.getTrainingWithId(trainingId).then (function (training) {
                $scope.chapter = training.chapters[chapterIndex];
                $http.get('/api/recordings/' + $scope.chapter.videodata.recording)
                .success(function (recording) {
                    $scope.recording = recording;    
                });
            });

            
            // implement state interface
            
            $scope.state.onLeftButtonPressed = function () {
            
            };

            $scope.state.onRightButtonPressed = function () {
           
            };
        }
    ]);
});
