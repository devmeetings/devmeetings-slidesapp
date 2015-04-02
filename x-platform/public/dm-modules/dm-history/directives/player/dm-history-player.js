/* jshint esnext:true */
'use strict';

import {
  toUrl
}
from 'require';
import * as _ from '_';

function getTimestamp(x) {
  return new Date(x).getTime();
}

class DmHistoryPlayer {

  constructor(data) {
    _.extend(this, data);
  }

  link(scope) {
    scope.mode = 'player';
    scope.state = {};
    scope.annotations = [];

    scope.$watch('historyId', (historyId) => {
      this.dmHistory.fetchHistorySince(historyId).then((history) => {
        var currentHist = _.find(history, function(h){
          return h._id === historyId;
        });
        var idx = history.indexOf(currentHist);
        // Player
        var current = JSON.parse(JSON.stringify(currentHist.original || {}));
        var player = this.dmPlayer.createPlayerSource(currentHist.patches[0].id, current);
        this.dmHistory.setHistory(history);
        // Player has to be fed with ne patches from external source.
        // We need to prepare ticker according to patches inside history.
        scope.recording = {
          player: player,
          slides: history.slice(idx)
        };

        var start = getTimestamp(currentHist.originalTimestamp);

        scope.annotations = [];
        scope.state = {
          isPlaying: false,
          currentSecond: 0.1,
          rate: 100,
          max: (getTimestamp(_.last(history).currentTimestamp) - start) / 1000
        };
      });
    });
  }

}


export function dmHistoryPlayer(dmHistory, dmPlayer, $timeout) {

  let history = new DmHistoryPlayer({
    dmHistory, dmPlayer, $timeout
  });

  return {
    restrict: 'E',
    scope: {
      historyId: '='
    },
    templateUrl: toUrl('./dm-history-player.html'),
    link: history.link.bind(history)
  };
}
