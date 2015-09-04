'use strict';

import template from './dm-dashboard.html!text';

export class DmDashboard {

  constructor () {
    this.name = 'World';
  }

}

DmDashboard.as = 'vm';
DmDashboard.tpl = template;
