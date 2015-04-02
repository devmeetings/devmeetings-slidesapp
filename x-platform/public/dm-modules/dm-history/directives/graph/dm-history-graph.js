/* jshint esnext:true */
'use strict';

import * as _ from '_';

class DmHistory {

  constructor(data) {
    _.extend(this, data);
  }

  link(scope) {
    scope.history = this.dmHistory;
  }

}


export function dmHistoryGraph(dmHistory) {

  let history = new DmHistory({
    dmHistory
  });

  return {
    restrict: 'E',
    scope: {},
    templateUrl: '/static/dm-modules/dm-history/directives/graph/dm-history-graph.html',
    link: history.link.bind(history)
  };
}
