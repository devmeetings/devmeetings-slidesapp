/* jshint esnext:true,-W097 */
'use strict';

import angular from 'angular';
import {dmOnline} from './directives/online/dm-online';

let mod = angular.module('dm-online', []);
mod.directive('dmOnline', dmOnline);
