/* globals define */
define(['angular',
  'angular-ui-router',
  'angular-bootstrap',
  'angular-moment',
  'slider/slider',
  'slider/slider.plugins'
], function (angular) {
  'use strict';

  return angular.module('dm-xplayer', [
    'slider', 'slider.plugins',
    'ui.router', 'ui.bootstrap',
    'angularMoment'
  ]);

});
