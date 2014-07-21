define(['angular',
        'dm-admin/dm-admin-app'
], function (angular, adminApp) {
    adminApp.controller('dmAdminChapter', ['$scope', '$stateParams', 'dmTrainings',
        function ($scope, $stateParams, dmTrainings) {
            var setupChapter = function () {
                $scope.chapter = angular.copy($scope.training.chapters[$stateParams.index]);
                if ($scope.chapter.videodata === undefined) {
                    $scope.chapter.videodata = {};
                }
                if ($scope.chapter.taskdata === undefined) {
                    $scope.chapter.taskdata = {};
                }
            };

            dmTrainings.getTrainingWithId($stateParams.id).then(function (training) {
                $scope.training = training;
                setupChapter();
            });
            
            $scope.saveChapter = function () {
                $scope.training.chapters[$stateParams.index] = $scope.chapter;
                dmTrainings.putTraining($scope.training);
            };

            $scope.cancelSaveChapter = function () {
                setupChapter();
            };


            $scope.videopreview = {
                src: '',
                currentSecond: 0,
                startSecond: 0
            };

            $scope.$watch('chapter.videodata.url', function (newVal) {
                $scope.videopreview.src = newVal;
            });
            
            $scope.$watch('chapter.videodata.timestamp', function (newVal) {
                $scope.videopreview.startSecond= newVal;
                $scope.videopreview.currentSecond= newVal;
            });
        }
    ]);
});
