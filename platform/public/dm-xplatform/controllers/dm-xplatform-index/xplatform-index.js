define(['module', 'angular', '_', 'angular-deckgrid', 'xplatform/xplatform-app', 'slider/slider', 'utils/ExtractPath'], function (module, angular, _, angularDeckgrid, xplatformApp, slider, ExtractPath) {

    var path = ExtractPath(module);
    
    angular.module('xplatform').controller('XplatformIndexCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {

        $scope.navbar.showTitle = false;

        $scope.sections = [{
            title: 'Szkolenia na żywo',
            sref: 'navbar.index.live'
        }, {
            title: 'Szkolenia online',
            sref: 'navbar.index.online'
        }, {
            title: 'Videoszkolenia',
            sref: 'navbar.index.video'
        }];  

    }]); 
});



