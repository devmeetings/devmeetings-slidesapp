var pluginsEvents = require('../events');
var Q = require('q');


var trainersRoom = function(roomId) {
    return roomId + '_trainers';
};

var getParticipants = function(io, roomId) {
    var clients = io.sockets.clients(roomId).map(function(socket) {
        return Q.ninvoke(socket, 'get', 'clientData');
    });

    return Q.all(clients);
};


exports.initSockets = function(io) {

    var sendParticipants = function(roomId) {
        getParticipants(io, roomId).then(function(participants) {
            io.sockets. in (trainersRoom(roomId)).emit('trainer.participants', participants);
        }, console.error);
    };

    pluginsEvents.on('room.joined', sendParticipants);
    pluginsEvents.on('room.left', sendParticipants);

};

exports.onSocket = function(log, socket, io) {
    socket.on('trainer.register', function(data, callback) {
        // TODO [ToDr] Check authorization
        callback({
            isAuthorized: true
        });

        socket.get('clientData', function(err, data) {
            data.isTrainer = true;
            socket.set('clientData', data);

            // Join trainers room
            socket.join(trainersRoom(data.deck));
            getParticipants(io, data.deck).then(function(participants) {
                socket.emit('trainer.participants', participants);
            }, console.error);
        });
    });
};