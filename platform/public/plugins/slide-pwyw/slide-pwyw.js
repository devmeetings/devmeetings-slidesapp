define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {
    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('slide', 'pwyw', 'slide-pwyw').directive('slidePwyw', [
        '$sce',
        function($sce) {
            return {
                restrict: 'E',
                scope: {
                    workshop: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-pwyw.html',
                link: function(scope) {
                    scope.$watch('workshop', function() {
                        scope.pwyw_url = $sce.getTrustedUrl($sce.trustAsUrl('http://devmeetings.pl/pay-what-you-want?work_shop=' + encodeURIComponent(scope.workshop)));
                    });
                }
            };
        }
    ]);

});