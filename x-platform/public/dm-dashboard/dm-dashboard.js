'use strict';

import app from './dm-dashboard-app';
import bootstrap from 'slider/bootstrap';

import './directives/index';

import {DmDashboard} from './components/dm-dashboard/dm-dashboard';

app.config(['$stateProvider', '$urlRouterProvider',

  function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('dashboard', {
      url: '/dashboard',
      controller: DmDashboard,
      controllerAs: DmDashboard.as,
      template: DmDashboard.tpl
    });

    $urlRouterProvider.otherwise('/dashboard');
  }
]);
bootstrap('dm-dashboard');
