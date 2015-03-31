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

      return States.save(save).then(function(save){
        
        return {
          save: save[0],
          patches: patches
        };

      });
    }).done(function(d) {
      var save = d.save;
      var id = save._id;
      var patchNo = save.patches.length - 1;

      ack(id, patchNo);

      // Broadcast new patches to listeners
      socket.broadcast.to(userRoom(socket.request.user._id)).emit('state.patches', {
        id: id + '_' + patchNo,
        patches: d.patches
      });
    });
  }

  function userRoom(userId) {
    return 'user_' + userId;
  }

  function subscribeToStates(userId) {
    socket.join(userRoom(userId));
  }

  function unsubscribeFromStates(userId) {
    socket.leave(userRoom(userId));
  }

  socket.on('state.patch', patchState);
  socket.on('state.subscribe', subscribeToStates);
  socket.on('state.unsubscribe', unsubscribeFromStates);
};
