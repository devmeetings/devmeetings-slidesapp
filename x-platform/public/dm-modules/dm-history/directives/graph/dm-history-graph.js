/* jshint esnext:true,-W097 */
'use strict';

import * as _ from '_';

class DmHistoryGraph {

  constructor(data) {
    _.extend(this, data);
  }

  link(scope) {
    let that = this;
    scope.history = that.dmHistory;
  
    scope.cutModel = {};
    
    scope.setCurrentTime = (model, prop) => {
      model[prop] = scope.history.historyPlayerState.currentSecond;
    };

    scope.convertToRecording = (model) => {
      let sinceId = scope.history.historyPlayerState.sinceId;
      let eventId = scope.history.historyPlayerState.eventId;
      scope.history.createRecordingFromHistory(eventId, sinceId, model.start, model.end)
        .then(
          ()=> that.$window.alert('Recording Created'), 
          () => that.$window.alert('Error while creating recording')
        );
    };
  }

}


export function dmHistoryGraph(dmHistory, $window) {

  let history = new DmHistoryGraph({
    dmHistory, $window
  });

  return {
    restrict: 'E',
    scope: {},
    templateUrl: '/static/dm-modules/dm-history/directives/graph/dm-history-graph.html',
    link: history.link.bind(history)
  };
}
