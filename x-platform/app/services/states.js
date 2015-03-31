var Statesave = require('../models/statesave');
var Q = require('q');
var jsondiff = require('jsondiffpatch');

var States = (function() {
  'use strict';
  return {

    applyPatches: function(current, patchList) {
      patchList.map(function(patchData) {
        jsondiff.patch(current, patchData.patch);
      });
    },

    save: function(data) {
      return Q.ninvoke(data, 'save');
    },

    fetchStateForWriting: function(id, user) {
      return fetchState(id, user).then(function(save) {
        if (save.patches.length < 100) {
          return save;
        }
        // Create new item in collection
        return createFork(save);
      });
    },

    fetchState: function(id, user) {
      return fetchState(id, user);
    },

    fetchForUser: function(userId, limit) {
      return Q.ninvoke(Statesave.find({
        user: userId
      }).sort({
        _id: -1
      }).limit(limit).lean(), 'exec');
    },

    getData: function(object, path) {
      return getData(object, preparePath(path));
    },

    createFromId: function(compoundId) {
      var idParts = compoundId.split('_');
      var id = idParts[0];
      var patchIdx = idParts[1];

      return Q.ninvoke(Statesave.findById(id).lean(), 'exec').then(function(save) {
        // Apply patches
        var state = save.original || {};
        States.applyPatches(state, save.patches.slice(0, patchIdx + 1));

        return state;
      });
    }
  };

}());

module.exports = States;

function createFork(state) {
  'use strict';

  var obj = new Statesave({
    user: state.user,
    previousState: state._id,
    workspaceId: state.workspaceId,
    originalTimestamp: state.currentTimestamp,
    original: state.current,
    currentTimestamp: state.currentTimestamp,
    current: JSON.parse(JSON.stringify(state.current)),
    patches: []
  });

  return Q.when(obj);
}

function fetchState(id, user) {
  'use strict';

  if (id) {
    return Q.ninvoke(Statesave, 'findById', id);
  }
  var obj = new Statesave({
    user: user._id,
    originalTimestamp: new Date(0),
    original: {},
    current: {}
  });
  obj.markModified('original');
  return Q.when(obj);
}



function getData(context, path) {
  'use strict';

  if (path.length === 0) {
    return context;
  }
  var part = path[0];
  if (context[part]) {
    return getData(context[part], path.slice(1));
  }
  return null;
}

function preparePath(path) {
  'use strict';

  return path.replace('.', '').split('.');
}
