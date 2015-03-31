exports.onSocket = function(log, socket, io) {
  'use strict';

  function joinEvent(eventId, ack) {
    var user = getUser();
    var room = eventRoom(eventId);
    log(user.name + ' joining ' + room);

    socket.join(room);
    // sending initial list of users
    ack(getAllUsers(room));

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

  function getAllUsers(room) {
    var users = findClientsSocket(room).map(function(socket) {
      return getUser(socket);
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
