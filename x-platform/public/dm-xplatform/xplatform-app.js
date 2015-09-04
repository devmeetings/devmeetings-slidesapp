/* globals define */
define(['angular',
  'angular-ui-router',
  'angular-moment',
  'angular-hotkeys',
  'angular-bootstrap',
  'angular-marked',
  'angular-animate',
  'angular-fullscreen',
  'angular-scrollbar',
  'slider/slider',
  'slider/slider.plugins',
  'dm-xplayer/dm-xplayer',
  'dm-modules/dm-user/dm-user',
  'dm-modules/dm-mongotime/dm-mongotime',
  'dm-modules/dm-gravatar/dm-gravatar',
  'dm-modules/dm-wavesurfer/dm-wavesurfer',
  'dm-modules/dm-browsertab/dm-browsertab',
  'dm-modules/dm-recorder/dm-recorder',
  'dm-modules/dm-intro/dm-intro',
  'dm-modules/dm-sref-show/dm-sref-show',
  'dm-modules/dm-online/dm-online',
  'dm-modules/dm-history/dm-history',
  'dm-modules/dm-local-data/dm-local-data'
], function (angular) {
  'use strict';

  return angular.module('xplatform', [
    'slider', 'slider.plugins',
    'ui.router', 'ui.bootstrap',
    'angularMoment', 'cfp.hotkeys', 'hc.marked', 'FBAngular', 'ngAnimate', 'ngScrollbar',
    'dm-xplayer', 'dm-user', 'dm-mongotime', 'dm-gravatar',
    'dm-wavesurfer', 'dm-browsertab', 'dm-recorder', 'dm-history', 'dm-online', 'dm-intro', 'dm-sref-show',
    'dm-local-data'
  ]);
});
