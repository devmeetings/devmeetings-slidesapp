define(['angular', 'xplatform/xplatform-app',
        'xplatform/directives/dm-spacesidebar/dm-spacesidebar'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformSpace', ['$scope', '$timeout', function ($scope, $timeout) {
        $scope.left = {
            min: '50px',
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


            if (open) {

                $('.dm-spacesidebar-right #stream').fadeOut(500);
                $('.dm-spacesidebar-right #issues').fadeOut(400);
                $('.dm-spacesidebar-right #chat').fadeOut(300);
                $('.dm-spacesidebar-right #docs').fadeOut(200);
                
                $timeout(function () {

                    right.current = right.max;
                    $timeout(function () {
                        right.opened = open;
                        
                        $('.dm-spacesidebar-right .tab-content').fadeIn(600);
                        $('.dm-spacesidebar-right #stream').fadeIn(200);
                        $('.dm-spacesidebar-right #issues').fadeIn(300);
                        $('.dm-spacesidebar-right #chat').fadeIn(400);
                        $('.dm-spacesidebar-right #docs').fadeIn(500);
                    }, 250);

                }, 500);

                return
            }

            $('.dm-spacesidebar-right #stream').fadeOut(500);
            $('.dm-spacesidebar-right #issues').fadeOut(400);
            $('.dm-spacesidebar-right #chat').fadeOut(300);
            $('.dm-spacesidebar-right #docs').fadeOut(200);

            $('.dm-spacesidebar-right .tab-content').fadeOut(600, function () {
                $scope.$apply(function () {
                    right.opened = open;
                    right.current = right.min;
            
                    $timeout(function () {
                        $('.dm-spacesidebar-right #stream').fadeIn(200);
                        $('.dm-spacesidebar-right #issues').fadeIn(300);
                        $('.dm-spacesidebar-right #chat').fadeIn(400);
                        $('.dm-spacesidebar-right #docs').fadeIn(500);
                    }, 250);
                });
            });
        };
    }]);
});

