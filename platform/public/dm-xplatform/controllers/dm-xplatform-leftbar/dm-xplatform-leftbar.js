define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformLeftbar', ['$scope', function ($scope) {
        
        $scope.sections = [{
            title: 'Tutoriale',
            sref: 'index.menu({type: "video"})'
        },{
            title: 'News feed',
            sref: 'index.stream'
        }];  

        var element = $('[class*="dm-xplatform-index-left"]').css('background-color', 'rgb(33,33,33)');

    }]);
});
