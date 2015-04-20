var _ = require('lodash');
var Q = require('q');
var store = require('../../config/store');

exports.getParticipants = function(io, roomId) {
    var clients = _.values(io.sockets.connected).filter(function(socket) {
      return socket.rooms.indexOf(roomId) !== -1;
    }).map(function(socket) {
      return socket.clientData;
    });
    return Q.when(clients);
};

exports.getClientData = function(socket) {
  return Q.ninvoke(store, 'get', 'socketClientData', socket.id);
};

exports.getParticipantsCount = function(io, roomId) {
    return io.sockets.clients(roomId).length;
};
