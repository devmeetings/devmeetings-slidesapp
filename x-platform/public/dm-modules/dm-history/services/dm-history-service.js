/*jshint esnext:true */
'use strict';

import * as _ from '_';


export class History {

  constructor(dmRecorder, $http) {
    _.extend(this, {
      $http
    });

    this.history = [];

    dmRecorder.listen('newState', (id, patchId, current) => {
      this.onNewState(id, patchId, current);
    });
    dmRecorder.listen('newWorkspace', (id) => {
      this.onNewWorkspace(id);
    });
  }


  getHistoryItem(id) {
    return _.find(this.history, function(item) {
      return item._id === id;
    });
  }

  fetchWorkspaceHistory(id) {
    return this.$http.get('/api/history/' + id).then((res) => {
      return res.data;
    });
  }

  // For player
  fetchHistorySince(id) {
    return this.$http.get('/api/history/since/' + id).then((res) => {
      return res.data;
    });
  }

  setHistory(history) {
    this.history = history;
  }

  // For recorder
  onNewWorkspace(id) {
    this.history = [];
    if (!id) {
      return;
    }
    this.fetchWorkspaceHistory(id).then((history) => {
      this.history = history;
    });
  }

  onNewState(id, patchId, current) {
    let last = _.last(this.history);
    let lastId = last ? last._id : null;
    if (lastId === id) {
      return;
    }

    this.history.push({
      _id: id,
      patches: [patchId],
      current: current
    });
  }

}
