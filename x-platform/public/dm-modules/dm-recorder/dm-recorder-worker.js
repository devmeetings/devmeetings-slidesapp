/* jshint esnext:true */
'use strict';

import jsondiffpatch from 'lib/json-diff';

class Worker {

  constructor() {
    this.state = null;
    this.clear();
  }

  newState(slide) {
    // Now calcualte diff
    var patch = jsondiffpatch.diff(this.state.current, slide);
    jsondiffpatch.patch(this.state.current, JSON.parse(JSON.stringify(patch)));

    return {
      timestamp: new Date().getTime(),
      patch: patch
    };
  }

  setId(id) {
    this.state.idOnServer = id;
  }

  getId() {
    return this.state.idOnServer;
  }

  clear() {
    this.state = {
      idOnServer: null,
      current: {},
    };
  }

}

export default Worker;
