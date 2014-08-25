define(['angular', 'xplatform/xplatform-app', 'xplatform/courses'], function(angular, xplatformApp) {
    xplatformApp.controller('dmXplatformInfo', ['$scope', '$stateParams', 'Courses',
        function($scope, $stateParams, Courses) {

            $scope.course = Courses.getCourseById($stateParams.id);

        }
    ]);
});
