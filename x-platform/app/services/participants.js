var Q = require('q');

exports.getParticipants = function(io, roomId) {
    var clients = io.sockets.clients(roomId).map(function(socket) {
        return Q.ninvoke(socket, 'get', 'clientData');
    });
    return Q.all(clients);
};

exports.getClientData = function(socket) {
    var result = Q.defer();
    socket.get('clientData', function(err, clientData) {
        result.resolve(clientData);
    });
    return result.promise;
};

exports.getParticipantsCount = function(io, roomId) {
    return io.sockets.clients(roomId).length;
};