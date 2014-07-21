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
        }
    ]);
});
