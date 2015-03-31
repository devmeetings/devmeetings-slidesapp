
var userWorkspacesForEvent = {};

exports.onSocket = function(log, socket, io) {
  'use strict';


  function joinEvent(eventData, ack) {
    var eventId = eventData.eventId;
    var user = getUser();
    var room = eventRoom(eventId);
    var userWorkspaces = userWorkspacesForEvent[eventId];
    if (!userWorkspaces) {
      userWorkspacesForEvent[eventId] = userWorkspaces = {};
    }

    // Update user's workspaceId;
    userWorkspaces[user._id] = eventData.workspaceId;
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
      return user;
    });
    return users;
  }

  function eventRoom(eventId) {
    return 'event_' + eventId;
  }

  socket.on('event.join', joinEvent);
  socket.on('event.leave', leaveEvent);


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
