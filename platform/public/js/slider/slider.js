define(['angular', './slider.plugins', "angular-bootstrap", "angular-animate"], function(angular) {
    var mod = angular.module('slider', ['slider.plugins', 'ui.bootstrap', 'ngAnimate']);

    mod.config(['$sceDelegateProvider',
        function($sceDelegateProvider) {
            $sceDelegateProvider.resourceUrlWhitelist([
                'self',
                'http://devmeetings.pl/**',
                'http://*.xplatform.org/**',
                'http://xplatform.org/**'
            ]);
        }
    ]);

    return mod;
});