/* jshint esnext:true */
'use strict';

import * as _ from '_';

function getTimestamp(x) {
  return new Date(x).getTime();
}


function convertSlidesToPatches(slides) {
  var start = getTimestamp(slides[0].originalTimestamp);

  var patches = slides.reduce(function(patches, slide) {

    let diff = getTimestamp(slide.originalTimestamp) - start;
    let newPatches = slide.patches.map(function(patch) {
      return {
        id: patch.id,
        timestamp: patch.timestamp + diff,
        patch: patch.patch
      };
    });

    return patches.concat(newPatches);

  }, []);


  //skip silence
  var silenceThreshold = 1000 * 60;
  var silenceGap = 1000 * 6;
  patches.reduce(function(memo, patch) {
    var diff = patch.timestamp - memo.last;
    if (diff > silenceThreshold) {
      memo.diff += diff - silenceGap;
    }

    memo.last = patch.timestamp;
    patch.timestamp -= memo.diff;
    return memo;
  }, {
    diff: 0,
    last: 0
  });

  return patches;
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
        var currentHist = _.find(history, function(h) {
          return h._id === historyId;
        });
        var idx = history.indexOf(currentHist);
        // Player
        var current = JSON.parse(JSON.stringify(currentHist.original || {}));
        var player = this.dmPlayer.createPlayerSource(currentHist.patches[0].id, current);
        this.dmHistory.setHistory(history);
        // Player has to be fed with ne patches from external source.
        // We need to prepare ticker according to patches inside history.
        var patches = convertSlidesToPatches(history.slice(idx));
        scope.recording = {
          player: player,
          patches: patches
        };

        scope.annotations = [];
        scope.state = {
          isPlaying: false,
          currentSecond: 0.1,
          rate: 100,
          max: _.last(patches).timestamp / 1000
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
    templateUrl: '/static/dm-modules/dm-history/directives/player/dm-history-player.html',
    link: history.link.bind(history)
  };
}
