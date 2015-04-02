/* jshint esnext:true */
'use strict';

import {
  toUrl
}
from 'require';
import * as _ from '_';

class DmHistoryPlayer {

  constructor(data) {
    _.extend(this, data);
  }

  link(scope) {
    scope.mode = 'player';
    scope.$watch('historyId', (historyId) => {
      this.dmHistory.fetchHistorySince(historyId).then((history) => {
        var currentHist = _.find(history, function(h){
          return h._id === historyId;
        });
        // Player
        var player = this.dmPlayer.createPlayerSource(currentHist.patches[0].id, currentHist.current);
        this.dmHistory.setHistory(history);
        // Temporary playe
        var that = this;
        (function() {
          var current = 0;

          function nextSlide() {
            var p = currentHist.patches;
            var patch = p[current];

            player.applyPatchesAndId({
              id: patch.id,
              patches: [patch] 
            });

            current += 1;
            if (current >= p.length) {
              return;
            }

            that.$timeout(nextSlide, 100);
          }

          nextSlide();
        }());
        // Player has to be fed with ne patches from external source.
        // We need to prepare ticker according to patches inside history.
        scope.history = history[0];
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
