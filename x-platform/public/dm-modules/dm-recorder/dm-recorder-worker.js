/* jshint esnext:true,-W097 */
'use strict';

import jsondiffpatch from 'lib/json-diff';
import _ from '_';

let jsondiffpatch2 = jsondiffpatch.create({
  textDiff: {
    minLength: 1024*100
  }
});

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
    this.state.lastPatchOnServer = idPatch.slice(1).join('_');
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
    var patch = jsondiffpatch2.diff(this.state.current, slide);
    if (!patch) {
      return;
    }

    jsondiffpatch2.patch(this.state.current, JSON.parse(JSON.stringify(patch)));
    return {
      timestamp: new Date().getTime(),
      patch: patch
    };
  }

}

export class Player extends Common {


  applyCurrentState(current) {
    // We have to keep the same reference! So let's just clear the object
    var obj = this.state.current;
    Object.keys(obj).forEach(function(key) {
      delete obj[key];
    });
    _.extend(obj, current);
  }

  getPatches(patchId) {
    if (patchId.current) {
      return [patchId.current];
    }
    return patchId.patches;
  }

  applyPatchesAndId(patches) {
    if (patches.current) {
      this.applyCurrentState(patches.current);
    } else {
      patches.patches.map((patch) => {
        jsondiffpatch2.patch(this.state.current, patch.patch);
      });
    }

    this.fillInIds(patches.id);
  }

  applyReversePatchesAndId(patches) {
    if (patches.current) {
      this.applyCurrentState(patches.current);
    } else {
      patches.patches.reverse().map((patch) => {
        var revPatch = jsondiffpatch2.reverse(patch.patch);
        jsondiffpatch2.patch(this.state.current, revPatch);
      });
    }

    this.fillInIds(patches.id);
  }

}
