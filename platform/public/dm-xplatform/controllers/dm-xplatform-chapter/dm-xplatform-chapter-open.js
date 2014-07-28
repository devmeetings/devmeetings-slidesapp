define(['angular',
        'xplatform/xplatform-app'
], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformChapterOpen', ['$scope', '$modalInstance', 'files', 'modalData',
        function ($scope, $modalInstance, files, modalData) {
            $scope.content = {
                files: files
            };

            $scope.selectFile = function (index) {
                $scope.content.index = index;
                modalData.openTitle = files[index];
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
