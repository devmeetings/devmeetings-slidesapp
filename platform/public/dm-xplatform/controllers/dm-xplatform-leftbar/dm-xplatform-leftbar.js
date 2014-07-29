define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformLeftbar', ['$scope', function ($scope) {
        
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
