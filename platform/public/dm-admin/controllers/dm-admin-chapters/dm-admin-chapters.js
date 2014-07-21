define(['module',
        'angular',
        '_',
        'dm-admin/dm-admin-app',
        'dm-admin/services/dm-trainings',
], function (module, angular, _, adminApp) {
    adminApp.controller('dmAdminChapters', ['$scope', '$http', '$stateParams', 'dmTrainings',
        function ($scope, $http, $stateParams, dmTrainings) {
            $scope.playerData = {
                title: ''
            };

            dmTrainings.getTrainingWithId($stateParams.id).then(function (training) {
                $scope.training = training;
            });
            
            var putTraining = function () {
                //return $http.put('/api/trainings/' + $scope.training._id, angular.copy($scope.training));
                dmTrainings.putTraining($scope.training)
            };

            $scope.addChapter = function () {
                if ($scope.training.chapters === undefined) {
                    $scope.training.chapters = [];
                }
                $scope.training.chapters.push({
                    title: $scope.playerData.title,
                    mode: 'video'
                });
                $scope.playerData.title = '';
                putTraining();
            };
            
            $scope.updateChaptersOrder = {
                stop: function (em, ui) {
                    putTraining();
                }
            }
            
        }
    ]);
});
