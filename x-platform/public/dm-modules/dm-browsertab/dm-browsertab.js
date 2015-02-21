define(['angular'], function(angular) {
    'use strict';

    angular.module('dm-browsertab', []).service('dmBrowserTab', function($rootScope) {
      return {

        setTitleAndIcon: function(title, icon) {
          $rootScope.title = title;
          this.setIcon(icon || 'xplatform');
          return this;
        },

        setIcon: function(icon) {
          $rootScope.icon = icon;
          return this;
        }
        
      };
    });
});
