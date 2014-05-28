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

var updateClientData = function(socket, updater) {
    socket.get('clientData', function(err, clientData) {
        updater(clientData);
        socket.set('clientData', clientData);
    });
};

var broadcastClientsToTrainers = function(io, roomId) {
    getParticipants(io, roomId).then(function(participants) {
        io.sockets. in (trainersRoom(roomId)).emit('trainer.participants', participants);
    }, console.error);
};


exports.initSockets = function(io) {

    var sendParticipants = function(roomId) {
        broadcastClientsToTrainers(io, roomId);
    };

    pluginsEvents.on('room.joined', sendParticipants);
    pluginsEvents.on('room.left', sendParticipants);

};

exports.onSocket = function(log, socket, io) {
    socket.on('slide.current.change', function(slide) {

        updateClientData(socket, function(clientData) {
            clientData.currentSlide = slide[0];

            broadcastClientsToTrainers(io, clientData.deck);
        });

    });

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