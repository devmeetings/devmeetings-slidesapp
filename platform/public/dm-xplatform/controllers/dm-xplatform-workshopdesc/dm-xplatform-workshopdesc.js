define(['angular', 'xplatform/xplatform-app', 'xplatform/courses'], function(angular, xplatformApp) {
    xplatformApp.controller('dmXplatformWorkshopdesc', ['$scope', '$stateParams', 'Courses',
        function($scope, $stateParams, Courses) {

            $scope.courses = Courses.courses;


            $scope.id = $stateParams.id;

            $scope.course = $scope.courses.filter(function(x) {
                return x.id == $stateParams.id;
            })[0];

        }
    ]);
});