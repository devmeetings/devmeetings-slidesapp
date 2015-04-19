var _ = require('lodash');
var States = require('../../services/states');
var cache = require('../../services/cache');

exports.onSocket = function(log, socket) {
  'use strict';


  function patchState(data, ack) {
    var workspaceRoom = getRoom(data);

    States.fetchStateForWriting(data._id, socket.request.user).then(function(save) {
      var patches = data.patches;

      if (save.fresh && data._id) {
        ack(false);
        return;
      }

      var originalTime = save.originalTimestamp.getTime();
      if (!originalTime) {
        save.originalTimestamp = new Date(patches[0].timestamp);
        originalTime = patches[0].timestamp;
      }

      if (patches[0].current) {
        save.current = patches[0].current;
        patches = [];
      }

      States.applyPatches(save.current, patches);

      save.currentTimestamp = new Date(_.last(patches).timestamp);
      // fix timestamps
      var last = save.noOfPatches;
      patches.map(function(patchData, idx) {
        patchData.id = save._id + '_' + (last + idx);
        patchData.timestamp = patchData.timestamp - originalTime;
      });
      // append Patches
      save.workspaceId = data.workspaceId;

      // NOTE [ToDr] For performance reasons not every field is being updated!
      return States.update(save, patches).then(function(save) {
        return {
          save: save,
          patches: patches
        };
      }).done(function(d) {
        // NOTE [ToDr] For performance reasons you won't get full document here!
        var save = d.save;
        var id = save._id;
        var patchNo = save.noOfPatches - 1;
        var compoundId = id + '_' + patchNo;

        ack(true, id, patchNo);

        // Populating cache
        cache.populate(compoundId, save.current).done();

        // Broadcast the whole slide
        var room = socket.broadcast.to(workspaceRoom);
        if (data._id !== id.toString()) {
          room.emit('state.patches', {
            id: compoundId,
            current: save.current
          });
          return;
        }
        // Broadcast new patches to listeners
        room.emit('state.patches', {
          id: compoundId,
          patches: d.patches
        });
      });
    });
  }


  function workspaceRoom(workspaceId) {
    return 'workspace_' + workspaceId;
  }

  function userRoom(userId) {
    return 'user_' + userId;
  }

  function getRoom(data) {
    if (data.workspaceId) {
      return workspaceRoom(data.workspaceId);
    }
    return userRoom(socket.request.user._id);
  }

  function subscribeToStates(workspaceId) {
    var room = workspaceRoom(workspaceId);
    log(socket.request.user.name + ' started listening to ' + room);
    socket.join(room);
  }

  function unsubscribeFromStates(workspaceId) {
    var room = workspaceRoom(workspaceId);
    log(socket.request.user.name + ' stopped listening to ' + room);
    socket.leave(room);
  }

  socket.on('state.patch', patchState);
  socket.on('state.subscribe', subscribeToStates);
  socket.on('state.unsubscribe', unsubscribeFromStates);
};
