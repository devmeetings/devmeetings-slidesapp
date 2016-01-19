import angular from 'angular';
import 'angular-ui-router';
import 'angular-moment';
import 'angular-bootstrap';
import 'angular-marked';
import 'angular-animate';
import 'angular-ui-router';
import 'slider/slider.plugins';

import 'dm-modules/dm-gravatar/dm-gravatar';

import 'dm-modules/dm-online/dm-online';

export default angular.module('dm-dashboard', [
  'slider.plugins', 'ui.router', 'ui.bootstrap',
  'angularMoment', 'hc.marked',
  'ngAnimate', 'dm-online', 'dm-gravatar'
]);
