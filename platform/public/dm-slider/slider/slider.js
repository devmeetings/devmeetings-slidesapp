define(['angular',
        './slider.plugins',
        "angular-bootstrap", "angular-animate", "angular-touch", "angular-slider", 'angular-ui-sortable',
        'angular-moment', 'angular-local-storage', 'angular-contenteditable', 'angulartics-ga', 'angular-marked',
        'angular-hotkeys', "angular-file-upload", "angular-jsonedit"
    ],
    function(angular) {
        var mod = angular.module('slider', [
            'slider.plugins', 'ui.bootstrap', 'ngAnimate',
            'vr.directives.slider', 'ui.sortable', 'angularMoment', 'LocalStorageModule', 'contenteditable',
            'angulartics', 'angulartics.google.analytics', 'hc.marked', 'cfp.hotkeys', 'angularFileUpload', 'JSONedit'
        ]);

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
