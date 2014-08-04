define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformLeftbar', ['$scope', function ($scope) {
        
        $scope.sections = [{
            title: 'News feed',
            sref: 'index.stream'
        },{
        /*    title: 'Szkolenia na żywo',
            sref: 'index.menu({type: "live"})'
        }, {
            title: 'Szkolenia online',
            sref: 'index.menu({type: "online"})'
        }, { */
            title: 'Tutoriale',
            sref: 'index.menu({type: "video"})'
        }];  

        var element = $('[class*="dm-xplatform-index-left"]').css('background-color', 'rgb(33,33,33)');

    }]);
});
