define(['module',
        'angular',
        '_',
        'dm-admin/dm-admin-app'
], function (module, angular, _, adminApp) {
    adminApp.controller('dmAdminTrainings', ['$scope',
        function ($scope) {
            $scope.trainings = [{
                title: 'Hello World'
            },{
                title: 'Wstęp do JS'
            }];

        }
    ]);
});
