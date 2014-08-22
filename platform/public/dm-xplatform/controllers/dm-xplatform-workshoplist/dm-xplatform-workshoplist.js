define(['angular', 'xplatform/xplatform-app', 'xplatform/courses'], function(angular, xplatformApp) {
    xplatformApp.controller('dmXplatformWorkshoplist', ['$scope', '$stateParams', 'Courses',
        function($scope, $stateParams, Courses) {
            $scope.filter = {
                by: ''
            };

            $scope.courses = [{
                tags: ['js', 'angular', 'web'],
                title: 'AngularJS - podstawy',
                isReady: true,
                description: '',
                image: 'static/images/workshopdesc/jsprog.jpg'
            }].concat(Courses.courses);
            var f = function(name, val) {
                return {
                    name: name,
                    value: val
                };
            };
            $scope.filters = [
                f('All', ''),
                f('Angular', 'angular'),
                f('Erlang', 'erlang'),
                f('Web Development', 'web'),
                f('Functional', 'functional'),
                f('Databases', 'db'),
                f('CSS', 'css'),
                f('MVC', 'mvc')
            ]
        }

    ]);
});