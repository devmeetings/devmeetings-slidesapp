define(['angular', 'xplatform/xplatform-app'], function(angular, xplatformApp) {
    xplatformApp.controller('dmXplatformWorkshopdesc', ['$scope', '$stateParams', 'Courses',
        function($scope, $stateParams, Courses) {

            $scope.courses = Courses.courses;
            
        // $scope.courses = [{
        //     id: 1,
        //     title: 'React + FLUX',
        //     description: '- Jaki problem rozwiązuje React?\n' +
        //         '- Jak React ma się do AngularJS a jak do Backbone?\n' +
        //         '- Na czym polega architektura FLUX\n',
        //     image: "static/images/workshopdesc/reactjs_flux.jpg"
        // }, {
        //     title: 'angu2',
        //     description: 'fsdfsdfsdf',
        //     image: "static/images/workshopdesc/teaser_ocaml.jpg"
        // }];

            $scope.id = $stateParams.id;

            $scope.course = $scope.courses.filter(function(x) {
                return x.id == $stateParams.id;
            })[0];

        }
    ]);
});