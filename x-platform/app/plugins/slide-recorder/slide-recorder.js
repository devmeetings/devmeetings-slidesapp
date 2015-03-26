var Statesave = require('../../models/statesave');
var Q = require('q');
var jsondiff = require('jsondiffpatch');
var _ = require('lodash');



var NEW_STATE_TIME_THRESHOLD = 5000 * 1000;

exports.onSocket = function(log, socket, io) {
  'use strict';

  function fetchState(id) {
    if (id) {
      return Q.ninvoke(Statesave, 'findById', id);
    }
    var obj = new Statesave({
      user: socket.handshake.user._id,
      originalTimestamp: new Date(0),
      original: {},
      current: {}
    });
    obj.markModified('original');

    return Q.when(obj);
  }


  function patchState(data, ack) {

    fetchState(data._id).then(function(save) {
      var patches = data.patches;
  
      var originalTime = save.originalTimestamp.getTime();
      if (!originalTime) {
        save.originalTimestamp = new Date(patches[0].timestamp);
        originalTime = patches[0].timestamp;
      }

      patches.map(function(patchData) {
        jsondiff.patch(save.current, patchData.patch);
        save.currentTimestamp = patchData.timestamp;
      });
      
      // fix timestamps
      patches.map(function(patchData) {
        patchData.timestamp = patchData.timestamp - originalTime;
      });

      // append Patches
      save.patches = save.patches.concat(patches);
      // Convert to date
      save.currentTimestamp = new Date(save.currentTimestamp);

      save.markModified('current');

      return Q.ninvoke(save, 'save');
    }).done(function(save) {
      ack(save[0]._id);
    });
  }

  socket.on('state.patch', patchState);
};
