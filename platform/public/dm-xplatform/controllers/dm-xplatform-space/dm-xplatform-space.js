define(['angular', 'xplatform/xplatform-app',
        'xplatform/services/dm-events/dm-events',
        'xplatform/directives/dm-spacesidebar/dm-spacesidebar'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformSpace', ['$scope', '$timeout', '$state', '$stateParams', 'dmEvents', function ($scope, $timeout, $state, $stateParams, dmEvents) {
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

        $scope.bottombarHeight = '0px';

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


        $scope.currentState = $state;
        $scope.$watch('currentState.current.name', function () {
            $scope.showTutorial = $state.current.name === 'index.space';
            $scope.bottombarHeight = $state.current.name === 'index.space.player' ? '25px' : '0px';
        });


        dmEvents.getEvent($stateParams.event, true).then(function (data) {
            $scope.event = data;
        }, function () {
        });

    }]);
});

