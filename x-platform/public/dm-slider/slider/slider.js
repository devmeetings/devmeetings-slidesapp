/* globals define */
define(['angular',
  './slider.plugins',
  'angular-bootstrap', 'angular-animate', 'angular-touch',
  'angular-moment', 'angular-local-storage', 'angular-contenteditable', 'angulartics', 'angulartics/dist/angulartics-ga.min', 'angular-marked',
  'angular-hotkeys', 'ng-file-upload', 'angular-tree-control'
],
  function (angular) {
    var mod = angular.module('slider', [
      'slider.plugins', 'ui.bootstrap', 'ngAnimate', 'ngTouch',
      'angularMoment', 'LocalStorageModule', 'contenteditable',
      'angulartics', 'angulartics.google.analytics', 'hc.marked', 'cfp.hotkeys', 'ngFileUpload',
      'treeControl'
    ]);

    mod.config(['$sceDelegateProvider',
      function ($sceDelegateProvider) {
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
