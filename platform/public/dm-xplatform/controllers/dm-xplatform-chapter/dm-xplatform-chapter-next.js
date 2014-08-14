define(['angular',
        'xplatform/xplatform-app'
], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformChapterNext', ['$scope', '$state', '$modalInstance', 'title', 'slideId', 'eventId',
        function ($scope, $state, $modalInstance, title, slideId, eventId) {
            $scope.content = {
                title: title
            };

            $scope.cancel = function () {
                $modalInstance.close(false);
            };

            $scope.task = function () {
                $modalInstance.close(false);
                $state.go('index.task', {
                    id: slideId, 
                    event: eventId
                });
            };

            $scope.ok = function () {
                $modalInstance.close(true);
            };
        }
    ]);
});
