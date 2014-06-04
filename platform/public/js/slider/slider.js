define(['angular', './slider.plugins', "angular-bootstrap", "angular-animate", "angular-touch", "angular-slider", 'angular-ui-sortable'], function(angular) {
    var mod = angular.module('slider', ['slider.plugins', 'ui.bootstrap', 'ngAnimate', 'vr.directives.slider', 'ui.sortable']);

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
