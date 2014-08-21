define(['angular', 'xplatform/xplatform-app'], function(angular, xplatformApp) {
    xplatformApp.controller('dmXplatformWorkshoplist', ['$scope', '$stateParams', 'Courses',
        function($scope, $stateParams, Courses) {

            $scope.courses = Courses.courses;

        }

    ]);
});