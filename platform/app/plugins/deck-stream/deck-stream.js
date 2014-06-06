exports.initSockets = function(io) {

};

exports.onSocket = function(log, socket, io) {
    socket.on('stream.status', function(status) {
        socket.broadcast.emit('stream.status', status);
    });
};