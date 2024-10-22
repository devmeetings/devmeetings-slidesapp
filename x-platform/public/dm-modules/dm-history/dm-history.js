'use strict';

import '../dm-recorder/dm-recorder';
import angular from 'angular';
import { History } from './services/dm-history-service';
import { dmHistoryGraph } from './directives/graph/dm-history-graph';
import { dmHistoryPlayer } from './directives/player/dm-history-player';

let mod = angular.module('dm-history', ['dm-recorder']);
mod.factory('dmHistory', ($http) => {
  let map = new WeakMap();

  return (dmRecorder) => {
    if (map.has(dmRecorder)) {
      return map.get(dmRecorder);
    }

    let history = new History(dmRecorder, $http);
    map.set(dmRecorder, history);
    return history;
  };
});

mod.directive('dmHistoryGraph', dmHistoryGraph);
mod.directive('dmHistoryPlayer', dmHistoryPlayer);
