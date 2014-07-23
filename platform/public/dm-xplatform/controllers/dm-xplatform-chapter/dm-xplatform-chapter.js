define(['angular',
        'xplatform/xplatform-app'
], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformChapter', ['$scope', '$stateParams', 'dmTrainings',
        function ($scope, $stateParams, dmTrainings) {
            $scope.chapterIndex = $stateParams.index;
        }
    ]);
});
