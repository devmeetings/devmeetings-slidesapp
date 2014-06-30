require(['config'], function () {
    require(['angular', '_', 'angular-gravatar', 'slider/slider'], function (angular, _, angularGravatar, slider) {
        angular.module('devhero').controller('DevheroIndexCtrl', ['$scope', function ($scope) {
            $scope.app = {
            };
        }]);
        angular.bootstrap(document, ['devhero']);
    });
});

