/* globals define */
define(['angular',
  'angular-ui-router',
  'ng-sortable',
  'dm-admin/slider-admin',
  'slider/slider',
  'slider/slider.plugins'
], function (angular, angularRouter) {
  return angular.module('dm-admin', [
    'ui.router', 'as.sortable',
    'slider', 'slider.plugins', 'slider.admin'
  ]);
});
