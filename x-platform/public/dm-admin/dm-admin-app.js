define(['angular',
  'angular-ui-router',
  'angular-ui-sortable',
  'dm-admin/slider-admin',
  'slider/slider',
  'slider/slider.plugins'
], function (angular, angularRouter) {
  return angular.module('dm-admin', [
    'ui.router', 'ui.sortable',
    'slider', 'slider.plugins', 'slider.admin'
  ]);
});
