var store = require('../../../config/store');

var userWorkspaceListeners = {};

exports.onSocket = function(log, socket, io) {
  'use strict';


  function joinEvent(eventData, ack) {
    var eventId = eventData.eventId;
    var user = getUser();
    var room = eventRoom(eventId);

    // Update user's workspaceId;


    TODO [ToDr] Rewrite all usages of userWorkspaces to store.
    store.set('userWorkspaces', eventId + '_' + user._id, eventData.workspaceId);

    user.workspaceId = eventData.workspaceId;
    log(user.name + ' joining ' + room);

    socket.join(room);
    // sending initial list of users
    var allUsers = getAllUsers(room, userWorkspaces);
    ack(allUsers);

    socket.broadcast.to(room).emit('event.user', {
      action: 'joined',
      eventId: eventId,
      user: user
    });

    socket.on('disconnect', function() {
      unsubscribeFrom.slice().map(function(workspaceId) {
        changeWorkspaceListenersCount(-1, workspaceId);
      });

      leaveEvent(eventId);
    });
  }

  function leaveEvent(eventId) {
    var user = getUser();
    var room = eventRoom(eventId);

    var userWorkspaces = userWorkspacesForEvent[eventId] || {};
    delete userWorkspaces[user._id];

    log(user.name + ' left ' + room);

    socket.leave(room);

    socket.broadcast.to(room).emit('event.user', {
      action: 'left',
      eventId: eventId,
      user: user
    });
  }

  function getUser(s) {
    s = s || socket;
    var user = s.request.user;

    return {
      _id: user._id,
      name: user.name,
      avatar: user.avatar
    };
  }

  function getAllUsers(room, userWorkspaces) {
    var users = findClientsSocket(room).map(function(socket) {
      return getUser(socket);
    }).map(function(user) {
      user.workspaceId = userWorkspaces[user._id];
      user.workspaceListeners = userWorkspaceListeners[user.worskpaceId] || 0;
      return user;
    });
    return users;
  }

  function eventRoom(eventId) {
    return 'event_' + eventId;
  }

  var unsubscribeFrom = [];

  function changeWorkspaceListenersCount(mod, workspaceId) {
    if (mod > 0) {
      unsubscribeFrom.push(workspaceId);
    } else {
      unsubscribeFrom.splice(unsubscribeFrom.indexOf(workspaceId), 1);
    }

    var count = userWorkspaceListeners[workspaceId] || 0;
    count += mod;
    userWorkspaceListeners[workspaceId] = count;

    socket.rooms.filter(function(room) {
      return room.indexOf('event_') === 0;
    }).map(function(roomName) {
      var msg = {
        action: 'state.count',
        workspaceId: workspaceId,
        count: count
      };
      // Broadcast
      socket.broadcast.to(roomName).emit('event.user', msg);
      // Send also to myself
      socket.emit('event.user', msg);
    });
  }

  socket.on('event.join', joinEvent);
  socket.on('event.leave', leaveEvent);

  socket.on('state.subscribe', changeWorkspaceListenersCount.bind(null, +1));
  socket.on('state.unsubscribe', changeWorkspaceListenersCount.bind(null, -1));

  function findClientsSocket(roomId, namespace) {
    var res = [],
      ns = io.of(namespace || '/'); // the default namespace is "/"

    if (!ns) {
      return res;
    }

    for (var id in ns.connected) {
      if (roomId) {
        var index = ns.connected[id].rooms.indexOf(roomId);
        if (index !== -1) {
          res.push(ns.connected[id]);
        }
      } else {
        res.push(ns.connected[id]);
      }
    }
    return res;
  }
};
