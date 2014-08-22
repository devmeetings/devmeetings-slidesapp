define(['angular', 'xplatform/xplatform-app'], function(angular, xplatformApp) {
    xplatformApp.controller('dmXplatformLeftbar', ['$scope', 'dmUser',
        function($scope, dmUser) {

            $scope.sections = [{
                title: 'Kursy',
                sref: 'index.courses'
            }, {
                title: 'News feed',
                sref: 'index.stream'
            }];

            dmUser.getCurrentUser().then(function(data) {
                $scope.user = data;
            });

            var element = $('[class*="dm-xplatform-index-left"]').css('background-color', 'rgb(33,33,33)');

        }
    ]);
});