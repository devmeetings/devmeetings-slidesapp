var Statesave = require('../models/statesave');
var recordings = require('../models/recording');
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
        if (save.noOfPatches < 100) {
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

    createFromRecordingId: function(compoundId) {
      var parts = compoundId.split('_');
      var recId = parts[0].replace('r', ''),
        slideNo = parts[1],
        patchNo = parseInt(parts[2], 10);
      
      return Q.ninvoke(recordings.findById(recId).lean(), 'exec').then(function(recording){
        var state = recording.slides[slideNo];
        States.applyPatches(state.original, state.patches.slice(0, patchNo + 1));
        return state.original;
      });
    },

    createFromId: function(compoundId) {
      if (compoundId[0] === 'r') {
        return States.createFromRecordingId(compoundId);
      }
      var idParts = compoundId.split('_');
      var id = idParts[0];
      var patchIdx = parseInt(idParts[1], 10);

      return Q.ninvoke(Statesave.findById(id).lean(), 'exec').then(function(save) {
        // Apply patches
        var state = save.original || {};
        States.applyPatches(state, save.patches.slice(0, patchIdx + 1));

        return state;
      });
    },

    getForWorkspaceId: function(workspaceId) {
      return Q.ninvoke(Statesave.find({
        workspaceId: workspaceId,
        noOfPatches: {
          $gte: 1
        }
      }).limit(100).select('current _id previousState currentTimestamp').lean().sort({
        'currentTimestamp': 1
      }), 'exec');
    },

    getSinceId: function(stateId) {

      function fetchHistory(workspaceId, timestampQuery, limit) {
        return Statesave.find({
          workspaceId: workspaceId,
          noOfPatches: {
            $gte: 1
          },
          currentTimestamp: timestampQuery
        }).lean().limit(limit).sort({
          'currentTimestamp': 1
        });
      }

      return Q.ninvoke(Statesave.findById(stateId).lean(), 'exec').then(function(save) {
        var after = Q.ninvoke(fetchHistory(save.workspaceId, {
          $gte: save.currentTimestamp
        }, 100), 'exec');
        var before = Q.ninvoke(fetchHistory(save.workspaceId, {
          $lt: save.currentTimestamp
        }, 10), 'exec');

        return Q.all([before, after]).then(function(a) {
          return a[0].concat(a[1]);
        });
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
    return Q.ninvoke(Statesave, 'findById', id).then(function(save) {
      if (!save) {
        throw Error('State not found');
      }
      return save;
    });
  }

  var obj = new Statesave({
    user: user._id,
    originalTimestamp: new Date(0),
    noOfPatches: 0,
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
