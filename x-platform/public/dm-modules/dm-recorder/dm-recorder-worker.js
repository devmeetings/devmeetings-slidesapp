/* jshint esnext:true */
'use strict';

import jsondiffpatch from 'lib/json-diff';
import _ from '_';

class Common {
  constructor() {
    this.state = null;
    this.clear();
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
    var patch = jsondiffpatch.diff(this.state.current, slide) || {};
    jsondiffpatch.patch(this.state.current, JSON.parse(JSON.stringify(patch)));

    return {
      timestamp: new Date().getTime(),
      patch: patch
    };
  }

  setId(id) {
    this.state.idOnServer = id;
  }

  setLastPatch(p) {
    this.state.lastPatchOnServer = p;
  }

}

export class Player extends Common {
  
  setState(slide) {
    this.state.current = slide;
  }

  applyPatchesAndId(patches) {
    if (patches.current) {
      // We have to keep the same reference! So let's just clear the object
      var obj = this.state.current;
      Object.keys(obj).forEach(function(key){
        delete obj[key];
      });
      _.extend(obj, patches.current);
    } else {
      patches.patches.map((patch) => {
        jsondiffpatch.patch(this.state.current, patch.patch);
      });
    }

    var idPatch = patches.id.split('_');
    this.state.idOnServer = idPatch[0];
    this.state.lastPatchOnServer = idPatch[1];
  }
}

