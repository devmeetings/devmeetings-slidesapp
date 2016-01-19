import angular from 'angular';
import 'angular-ui-router';
import 'angular-moment';
import 'angular-bootstrap';
import 'angular-marked';
import 'angular-animate';
import 'angular-ui-router';
import 'slider/slider.plugins';

export default angular.module('dm-courses', [
  'slider.plugins', 'ui.router', 'ui.bootstrap',
  'angularMoment', 'marked',
  'ngAnimate'
]);
