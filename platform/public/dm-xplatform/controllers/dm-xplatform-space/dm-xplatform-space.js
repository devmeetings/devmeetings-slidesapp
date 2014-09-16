define(['angular', 'xplatform/xplatform-app',
        'xplatform/directives/dm-spacesidebar/dm-spacesidebar'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformSpace', ['$scope', '$timeout', function ($scope, $timeout) {
        $scope.left = {
            min: '40px',
            max: '200px',
            current: '200px'
        };

        $scope.right = {
            min: '50px',
            max: '330px',
            current: '330px',
            opened: true
        };

        $scope.tabs = {};

        $scope.toggleRight = function (open) {
            var right = $scope.right;
            open = open === undefined ? !right.opened : open;
           
            if (open === right.opened) {
                return;
            }

            right.opened = open;
            if (open) {
                right.current = right.max;
                $timeout(function () {
                    $('.dm-spacesidebar-right .tab-content').fadeIn(100);
                }, 500);
                return
            }

            $('.dm-spacesidebar-right .tab-content').fadeOut(100, function () {
                $scope.$apply(function () {
                    right.current = right.min;
                });
            });
        };
    }]);
});

