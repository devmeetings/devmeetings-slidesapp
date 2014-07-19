define(['module',
        'angular',
        '_',
        'dm-admin/dm-admin-app'
], function (module, angular, _, adminApp) {
    adminApp.controller('dmAdminPlayer', ['$scope', '$stateParams',
        function ($scope, $stateParams) {
            $scope.title = $stateParams.title;
            $scope.chapters = [{
                title: 'Hello World',
                type: 'video',    
                videoData: {
                    video: '',
                    timestamp: 0,
                    snapshots: []
                }
            }];

        }
    ]);
});
