define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {
    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('slide', 'pwyw', 'slide-pwyw', 50).directive('slidePwyw', [
        '$sce',
        function($sce) {
            return {
                restrict: 'E',
                scope: {
                    workshopData: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-pwyw.html',
                link: function(scope) {
                    scope.$watch('workshopData', function() {
                        scope.pwyw_url = $sce.getTrustedUrl($sce.trustAsUrl('http://devmeetings.pl/pay-what-you-want?term_id=' + encodeURIComponent(scope.workshopData.workshop) + '&price=' + scope.workshopData.payment));
                    });
                }
            };
        }
    ]);

});