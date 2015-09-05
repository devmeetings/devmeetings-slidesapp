var store = require('../../services/store');
var Q = require('q');
var _ = require('lodash');
var pluginEvents = require('../events');
var eventRoom = require('../eventRoom');

// Clearing on Start
store.del('listeners');
store.smembers('events').done(function (events) {
  'use strict';
  events.forEach(function (ev) {
    store.del(eventRoom(ev));
  });
});

exports.onSocket = function (log, socket, io) {
  'use strict';

  function joinEvent (eventData, ack) {
    var eventId = eventData.eventId;
    var user = getUser();
    var room = eventRoom(eventId);

    // Add event for cleanup later
    store.sadd('events', eventId);

    // Register in store
    user.workspaceId = eventData.workspaceId;
    store.hset(room, user._id, JSON.stringify(user));

    log(user.name + ' joining ' + room);

    socket.join(room);
    pluginEvents.emit('rejoin', socket, {
      joined: true,
      name: room,
      msg: 'event.join',
      args: eventData
    });

    // sending initial list of users
    getAllUsers(room).done(function (allUsers) {
      ack(_.values(allUsers));
    });

    user.workspaceListeners = 0;
    console.log('Broadcasting user joined');
    socket.broadcast.to(room).emit('event.user', {
      action: 'joined',
      eventId: eventId,
      user: user
    });

    socket.on('disconnect', function () {
      unsubscribeFrom.slice().map(function (workspaceId) {
        changeWorkspaceListenersCount(-1, workspaceId);
      });

      leaveEvent(eventId);
    });
  }

  function leaveEvent (eventId) {
    var user = getUser();
    var room = eventRoom(eventId);

    store.hdel(room, user._id);

    log(user.name + ' left ' + room);

    socket.leave(room);
    pluginEvents.emit('rejoin', socket, {
      joined: false,
      name: room
    });

    socket.broadcast.to(room).emit('event.user', {
      action: 'left',
      eventId: eventId,
      user: user
    });
  }

  function getUser () {
    var user = socket.request.user;

    return {
      _id: user._id,
      name: user.name,
      avatar: user.avatar
    };
  }

  function hashValuesToJson (obj) {
    if (!obj) {
      return {};
    }
    Object.keys(obj).map(function (k) {
      obj[k] = JSON.parse(obj[k]);
    });
    return obj;
  }

  function getAllUsers (room) {
    var users = store.hgetall(room).then(hashValuesToJson);
    var workspaceListeners = store.hgetall('listeners').then(hashValuesToJson);

    return Q.all([users, workspaceListeners]).then(function (data) {
      var users = data[0];
      var listeners = data[1];

      Object.keys(users).map(function (userId) {
        var user = users[userId];
        user.workspaceListeners = listeners[user.workspaceId] || 0;
      });

      return users;
    });
  }

  /*
   *  TODO [ToDr] Not sure if we can store this in memory
   *  In theory when sticky sessions are enabled it should be ok
   *  (the data is local to the specifc socket)
   */
  var unsubscribeFrom = [];

  function changeWorkspaceListenersCount (mod, workspaceId) {
    if (mod > 0) {
      unsubscribeFrom.push(workspaceId);
    } else {
      unsubscribeFrom.splice(unsubscribeFrom.indexOf(workspaceId), 1);
    }

    store.hincrby('listeners', workspaceId, mod).done(function (count) {
      socket.rooms.filter(function (room) {
        return room.indexOf('event_') === 0;
      }).map(function (roomName) {
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
    });
  }

  socket.on('event.join', joinEvent);
  socket.on('event.leave', leaveEvent);

  socket.on('state.subscribe', changeWorkspaceListenersCount.bind(null, +1));
  socket.on('state.unsubscribe', changeWorkspaceListenersCount.bind(null, -1));
};
