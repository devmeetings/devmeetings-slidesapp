define(['angular', 'favico.js'], function(angular, Favico) {
  'use strict';

  angular.module('dm-browsertab', []).service('dmBrowserTab', function($rootScope, $timeout) {

    return {

      setTitleAndIcon: function(title, icon) {
        $rootScope.title = title;
        this.withIcon(icon || 'icon');
        return this;
      },

      withIcon: function(icon) {
        $rootScope.icon = icon;
        return this;
      },

      withBadge: function(badge) {
        //we have to wait for new icon to load.
        $timeout(function() {
          var favico = new Favico({
            animation: 'none',
            bgColor: '#000',
            textColor: '#eee',
            fontStyle: 'normal',
            element: document.querySelector('link[rel="icon"][type="image/png"]')
          });
          favico.badge(badge);
        }, 1000);
      }

    };
  });
});
