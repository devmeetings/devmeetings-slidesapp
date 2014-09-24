define(['angular', 'xplatform/xplatform-app', 'slider/slider.plugins'], function (angular, xplatformApp, sliderPlugins) {
    xplatformApp.directive('dmChat', [function () {
        
        return {
            restrict: 'E',
            scope: {
                name: '@'       
            },
            replace: true,
            template: '<iframe class="dm-chat-iframe"></iframe>',
            link: function (scope, element) {
            
                scope.$watch('name', function () {
                    if (!scope.name) {
                        return;
                    }

                    var name = encodeURI(scope.name.replace(/[^0-9a-zA-Z]/g, '_'));
                    var host = 'applejack.todr.me';
                    element[0].src = 'http://xplatform.org:8001/#/?autologin=true&host=' + host + '&port=6667&nick=' + name + '&realname=' + name + '&join=#xplatform-irc';
                });

                sliderPlugins.listen(scope, 'slide.share', function (message) {
                    element[0].contentWindow.postMessage(message, 'http://xplatform.org:8001');
                });
            }
        };
    }]);
});

