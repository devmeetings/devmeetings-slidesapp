define(['angular',
        'xplatform/xplatform-app'
], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformChapterSave', ['$scope', '$modalInstance', 'title',
        function ($scope, $modalInstance, title) {
            $scope.content = {
                fileTitle: title
            };

            $scope.ok = function () {
                $modalInstance.close($scope.content.fileTitle);
            };
        }
    ]);
});
