define(['angular',
        'xplatform/xplatform-app'
], function (angular, xplatformApp) {   
    xplatformApp.controller('dmXplatformPlayer', ['$scope', '$stateParams', 'dmTrainings',
        function ($scope, $stateParams, dmTrainings) {
            var trainingId = $stateParams.id;

            dmTrainings.getTrainingWithId(trainingId).then( function (training) {
                $scope.training = training;
            });
        }
    ]);
});

