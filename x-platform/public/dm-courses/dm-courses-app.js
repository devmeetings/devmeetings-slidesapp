define(['angular',
  'angular-ui-router',
  'angular-moment',
  'angular-hotkeys',
  'angular-bootstrap',
  'angular-marked',
  'angular-animate',
  'angular-ui-router',
  'slider/slider.plugins'
], function (angular) {
  return angular.module('dm-courses', [
    'slider.plugins', 'ui.router', 'ui.bootstrap',
    'angularMoment', 'cfp.hotkeys', 'hc.marked',
    'ngAnimate'
  ]);
});
