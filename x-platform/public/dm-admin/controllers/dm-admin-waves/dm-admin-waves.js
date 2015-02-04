define(['module', 
        'angular',
        '_',
        'dm-admin/dm-admin-app'
], function (module, angular, _, adminApp) {
    adminApp.controller('dmAdminWaves', ['$scope', '$http',
        function ($scope, $http) {
            $http.get('/editor/soundslist').success(function (sounds) {
                $scope.sounds = sounds;
            });
            $http.get('/editor/reclist').success(function (recordings) {
                $scope.recordings = recordings;
            });
        }
    ]);
});
