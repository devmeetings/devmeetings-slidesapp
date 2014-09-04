define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformEditSnippet', ['$scope', '$modalInstance', 'editedContent', 'editedContentType', function ($scope, $modalInstance, editedContent, editedContentType) {
        $scope.editedContent = editedContent;
        $scope.editedContentType = editedContentType;

        $scope.done = function () {

            $modalInstance.close(true);
        };
    }]);
});
