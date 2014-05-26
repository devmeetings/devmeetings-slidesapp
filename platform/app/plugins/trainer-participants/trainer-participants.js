var pluginsEvents = require('../events');


var trainersRoom = function(roomId) {
    return roomId + '_trainers';
};

var getParticipants = function(io, roomId) {
    var clientIds = io.sockets.clients(roomId).map(function(socket) {
        return socket.id;
    });

    return {
        clients: clientIds
    };
};


exports.initSockets = function(io) {

    var sendParticipants = function(roomId) {
        var participants = getParticipants(io, roomId);
        io.sockets. in (trainersRoom(roomId)).emit('trainer.participants', participants);
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
            // Join trainers room
            socket.join(trainersRoom(data.deck));
            socket.emit('trainer.participants', getParticipants(io, data.deck));
        });
    });
};