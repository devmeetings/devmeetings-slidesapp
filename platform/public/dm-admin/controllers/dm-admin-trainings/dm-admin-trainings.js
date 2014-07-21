define(['module',
        'angular',
        '_',
        'dm-admin/dm-admin-app',
        'dm-admin/services/dm-trainings'
], function (module, angular, _, adminApp) {
    adminApp.controller('dmAdminTrainings', ['$scope', 'dmTrainings',
        function ($scope, dmTrainings) {
            $scope.trainingsData = {
                title: ''
            }
            
            dmTrainings.getTrainings().success(function (trainings) {
                $scope.trainings = trainings;
            });
            
            $scope.addTraining = function () {
                dmTrainings.addTraining($scope.trainingsData.title);
                $scope.trainingsData.title = '';
            }
            
            $scope.updateTrainingsOrder = {
                stop: function (em, ui) {
                    // update order on server side      
                }
            };
        }
    ]);
});
