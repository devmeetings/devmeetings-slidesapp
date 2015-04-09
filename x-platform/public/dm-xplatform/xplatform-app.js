define(['angular',
  'angular-ui-router',
  'angular-gravatar',
  'angular-moment',
  'angular-hotkeys',
  'angular-bootstrap',
  'angular-marked',
  'angular-charts',
  'angular-animate',
  'angular-fullscreen',
  'slider/slider',
  'slider/slider.plugins',
  'dm-xplayer/dm-xplayer',
  'dm-modules/dm-user/dm-user',
  'dm-modules/dm-mongotime/dm-mongotime',
  'dm-modules/dm-gravatar/dm-gravatar',
  'dm-modules/dm-wavesurfer/dm-wavesurfer',
  'dm-modules/dm-browsertab/dm-browsertab',
  'dm-modules/dm-recorder/dm-recorder',
  'es6!dm-modules/dm-history/dm-history'
], function(angular) {

  'use strict';

  // [ToDr] AMD sucks.
  require(["FBAngular"]);

  return angular.module('xplatform', [
    'slider', 'slider.plugins',
    'ui.gravatar', 'ui.router', 'ui.bootstrap',
    'angularMoment', 'cfp.hotkeys', 'hc.marked', 'angularCharts', 'FBAngular', 'ngAnimate',
    'dm-xplayer', 'dm-user', 'dm-mongotime', 'dm-gravatar', 
    'dm-wavesurfer', 'dm-browsertab', 'dm-recorder', 'dm-history'
  ]);
});
