var pluginsEvents = require('../events');
var Participants = require('../../services/participants');

var broadcastPeopleCount = function(io, roomId) {
    io.sockets.in(roomId).emit('people.counter', {
        peopleCount: Participants.getParticipantsCount(io, roomId)
    });
};

exports.initSockets = function(io) {
    var sendPeopleCount = function(roomId) {
        broadcastPeopleCount(io, roomId);
    };

    pluginsEvents.on('room.joined', sendPeopleCount);
    pluginsEvents.on('room.left' , sendPeopleCount);
};

exports.onSocket = function(log, socket, io){

    var getPeopleCount = function(data, callback) {
        callback({
            peopleCount: Participants.getParticipantsCount(io, data.deck)
        });
    };

    socket.on('people.counter.get', getPeopleCount);
};
