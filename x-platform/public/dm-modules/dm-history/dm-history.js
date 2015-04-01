/* jshint esnext:true */
'use strict';

import '../dm-recorder/dm-recorder';
import * as angular from 'angular';
import {History} from 'es6!./services/dm-history-service';
import {dmHistoryDirective} from 'es6!./directives/dm-history-directive';

let mod = angular.module('dm-history', ['dm-recorder']);
mod.service('dmHistory', History);
mod.directive('dmHistory', dmHistoryDirective);
