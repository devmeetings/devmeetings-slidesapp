define(['angular',
        'xplatform/xplatform-app'
], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformChapterOpen', ['$scope', '$modalInstance', 'files',
        function ($scope, $modalInstance, files) {
            $scope.content = {
                files: files
            };

            $scope.selectFile = function (index) {
                $scope.content.index = index;
            };
           
            $scope.cancel = function () {
                $modalInstance.close(false);
            };

            $scope.ok = function () {
                $modalInstance.close(true, files[$scope.content.index]);
            };
        }
    ]);
});
