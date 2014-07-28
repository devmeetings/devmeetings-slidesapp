define(['angular',
        'xplatform/xplatform-app'
], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformChapterSave', ['$scope', '$modalInstance', 'modalData',
        function ($scope, $modalInstance, modalData) {
           
            $scope.modalData = modalData;
            $scope.cancel = function () {
                $modalInstance.close(false);
            };

            $scope.ok = function () {
                $modalInstance.close(true);
            };
        }
    ]);
});
