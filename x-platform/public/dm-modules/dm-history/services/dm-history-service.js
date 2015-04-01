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

  fetchHistory(id) {
    this.$http.get('/api/history/' + id).then((res) => {
      this.history = res.data;
    });
  }

  onNewWorkspace(id) {
    this.history = [];
    if (!id) {
      return;
    }
    this.fetchHistory(id);
  }

  onNewState(id, patchId, current) {
    console.log('New state', id, patchId, current);
    // TODO if id is different save also current
    // ignore patchId
    this.history.push({
      _id: id,
    });
  }

}
