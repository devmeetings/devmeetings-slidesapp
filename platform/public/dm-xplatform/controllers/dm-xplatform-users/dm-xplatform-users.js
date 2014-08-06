define(['angular',
        'xplatform/xplatform-app'
], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformUsers', ['$scope', '$modalInstance', '$state', 'users',
        function ($scope, $modalInstance, $state, users) {
    
            $scope.users = users;

            $scope.showUser = function (user) {
                $modalInstance.close();
                $state.go('index.devhero', {id: user.userId});
            };

            $scope.close = function () {
                $modalInstance.close();
            };
        }
    ]);
});
