var pluginsEvents = require('../events');


var socketIo;

var trainersRoom = function(roomId) {
    return roomId + '_trainers';
};

pluginsEvents.on('room.joined', function(roomId) {
    if (!socketIo) {
        return;
    }

    var clientsIds = socketIo.sockets.clients(roomId).map(function(socket) {
        return socket.id;
    });

    socketIo.sockets. in (trainersRoom(roomId)).emit('trainer.participants', {
        clients: clientsIds
    });
});

exports.socketInit = function(log, socket, io) {
    //TODO [ToDr] OMG, please kill me.
    socketIo = io;

    socket.on('trainer.register', function(data, callback) {
        // TODO [ToDr] Check authorization
        callback({
            isAuthorized: true
        });

        socket.get('deck.current', function(err, deck) {
            // Join trainers room
            socket.join(trainersRoom(deck));
        });
    });
};