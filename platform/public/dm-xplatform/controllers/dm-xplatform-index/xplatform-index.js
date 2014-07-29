define(['module', 'angular', '_', 'angular-deckgrid', 'xplatform/xplatform-app', 'slider/slider', 'utils/ExtractPath'], function (module, angular, _, angularDeckgrid, xplatformApp, slider, ExtractPath) {

    var path = ExtractPath(module);
    
    angular.module('xplatform').controller('XplatformIndexCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {

        $scope.navbar.showTitle = false;

        $scope.sections = [{
            title: 'Szkolenia na żywo',
            sref: 'live'
        }, {
            title: 'Szkolenia online',
            sref: 'online'
        }, {
            title: 'Videoszkolenia',
            sref: 'video'
        }];  

    }]); 
});



