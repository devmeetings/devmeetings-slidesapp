/* jshint esnext:true,-W097 */
'use strict';

import '../dm-recorder/dm-recorder';
import angular from 'angular';
import {History} from './services/dm-history-service';
import {dmHistoryGraph} from './directives/graph/dm-history-graph';
import {dmHistoryPlayer} from './directives/player/dm-history-player';

let mod = angular.module('dm-history', ['dm-recorder']);
mod.factory('dmHistory', ($http)=>{
  return (dmRecorder) => new History(dmRecorder, $http);
});

mod.directive('dmHistoryGraph', dmHistoryGraph);
mod.directive('dmHistoryPlayer', dmHistoryPlayer);
