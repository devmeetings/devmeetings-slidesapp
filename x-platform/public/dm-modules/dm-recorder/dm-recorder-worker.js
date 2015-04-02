/* jshint esnext:true */
'use strict';

import jsondiffpatch from 'lib/json-diff';
import _ from '_';

class Common {
  constructor() {
    this.state = null;
    this.clear();
  }

  setState(statesaveId, slide) {
    this.state.current = slide;
    this.fillInIds(statesaveId);
  }

  fillInIds(id) {
    if (!id) {
      return;
    }
    var idPatch = id.split('_');
    this.state.idOnServer = idPatch[0];
    this.state.lastPatchOnServer = idPatch[1];
  }

  getId() {
    return this.state.idOnServer;
  }

  getLastPatch() {
    return this.state.lastPatchOnServer;
  }

  clear() {
     this.state = {
      idOnServer: null,
      lastPatchOnServer: null,
      current: {},
    };
  }

}

export class Recorder extends Common {

  newState(slide) {
    // Now calcualte diff
    var patch = jsondiffpatch.diff(this.state.current, slide);
    if (!patch) {
      return;
    }

    jsondiffpatch.patch(this.state.current, JSON.parse(JSON.stringify(patch)));
    return {
      timestamp: new Date().getTime(),
      patch: patch
    };
  }

}

export class Player extends Common {

  applyPatchesAndId(patches) {
    if (patches.current) {
      // We have to keep the same reference! So let's just clear the object
      var obj = this.state.current;
      Object.keys(obj).forEach(function(key) {
        delete obj[key];
      });
      _.extend(obj, patches.current);
    } else {
      patches.patches.map((patch) => {
        jsondiffpatch.patch(this.state.current, patch.patch);
      });
    }

    this.fillInIds(patches.id);
  }
}
