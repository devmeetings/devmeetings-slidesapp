define(['angular',
        'xplatform/xplatform-app'
], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformChapterNext', ['$scope', '$modalInstance', 'title',
        function ($scope, $modalInstance, title) {
            $scope.content = {
                title: title
            };

            $scope.cancel = function () {
                $modalInstance.close(false);
            };

            $scope.ok = function () {
                $modalInstance.close(true);
            };
        }
    ]);
});
