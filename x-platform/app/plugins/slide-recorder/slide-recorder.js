var _ = require('lodash');
var States = require('../../services/states');

exports.onSocket = function(log, socket) {
  'use strict';


  function patchState(data, ack) {
    States.fetchState(data._id, socket.request.user).then(function(save) {
      var patches = data.patches;

      var originalTime = save.originalTimestamp.getTime();
      if (!originalTime) {
        save.originalTimestamp = new Date(patches[0].timestamp);
        originalTime = patches[0].timestamp;
      }


      States.applyPatches(save.current, patches);
    
      save.currentTimestamp = new Date(_.last(patches).timestamp);
      // fix timestamps
      patches.map(function(patchData) {
        patchData.timestamp = patchData.timestamp - originalTime;
      });
      // append Patches
      save.patches = save.patches.concat(patches);

      save.markModified('current');

      return States.save(save);
    }).done(function(save) {
      ack(save[0]._id, save[0].patches.length - 1);
    });
  }

  socket.on('state.patch', patchState);
};
