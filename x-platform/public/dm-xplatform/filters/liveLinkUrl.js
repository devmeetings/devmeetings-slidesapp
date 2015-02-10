define(['angular', 'xplatform/xplatform-app'], function(angular, xplatformApp) {
  'use strict';

  xplatformApp.filter('liveLinkUrl', ['$sce', function($sce) {
    return function(input, arg) {
      if (!input) {
        return '';
      }
      return $sce.trustAsUrl(input) + '/' + arg;
    };  
  }]);
});

