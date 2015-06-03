define(['angular',
        './slider.plugins',
        'angular-bootstrap', 'angular-animate', 'angular-touch', 'angular-ui-sortable',
        'angular-moment', 'angular-local-storage', 'angular-contenteditable', 'angulartics', 'angular-marked',
        'angular-hotkeys', 'angular-file-upload', 'json-edit'
    ],
    function(angular) {
        var mod = angular.module('slider', [
            'slider.plugins', 'ui.bootstrap', 'ngAnimate', 'ngTouch',
            'ui.sortable', 'angularMoment', 'LocalStorageModule', 'contenteditable',
            'angulartics', 'angulartics.google.analytics', 'hc.marked', 'cfp.hotkeys', 'angularFileUpload', 'JSONedit'
        ]);

        mod.config(['$sceDelegateProvider',
            function($sceDelegateProvider) {
                $sceDelegateProvider.resourceUrlWhitelist([
                    'self',
                    'http://localhost:3001/**',
                    'http://devmeetings.pl/**',
                    'http://*.xplatform.org/**',
                    'http://xplatform.org/**'
                ]);
            }
        ]);

        return mod;
    });
