/* jshint esnext:true,-W097 */
'use strict';

import * as _ from '_';


class DmHistoryPlayer {

  constructor(data) {
    _.extend(this, data);
  }

  link(scope) {
    scope.mode = 'player';
    scope.state = {};
    scope.annotations = [];

    scope.$watch('historyId', updatePlayer);
    scope.$watch('recorderHistory', updatePlayer);

    let self = this;

    function updatePlayer() {
      if (!scope.historyId || !scope.recorderHistory) {
        return;
      }
      let historyId = scope.historyId;
      let historyService = self.dmHistory(scope.recorderHistory);
      // TODO [ToDr] $rootScope!
      self.$rootScope.recorder = scope.recorderHistory;
      historyService.fetchHistorySince(historyId).then((history) => {
        var currentHist = history.recording;
        // Player
        var current = JSON.parse(JSON.stringify(currentHist.original));
        var player = self.dmPlayer.createPlayerSource(null, currentHist.patches[0].id, current);

        // Setting history has to be done after player is created!
        historyService.setHistory(history.history);
        // Player has to be fed with ne patches from external source.
        // We need to prepare ticker according to patches inside history.
        scope.recording = {
          player: player,
          patches: currentHist.patches
        };

        scope.annotations = currentHist.annotations;
        scope.state = historyService.setPlayerState({
          sinceId: historyId,
          eventId: scope.eventId,
          isPlaying: false,
          currentSecond: 0.1,
          rate: 40,
          max: _.last(currentHist.patches).timestamp / 1000
        });
      });
    }
  }

}


export function dmHistoryPlayer(dmHistory, dmPlayer, $rootScope, $timeout) {

  let history = new DmHistoryPlayer({
    dmHistory, dmPlayer, $rootScope, $timeout
  });

  return {
    restrict: 'E',
    scope: {
      historyId: '=',
      eventId: '='
    },
    templateUrl: '/static/dm-modules/dm-history/directives/player/dm-history-player.html',
    link: history.link.bind(history)
  };
}
