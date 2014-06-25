var Stream = require('../../services/stream');

var pluginEvents = require('../events');

var streamRoom = function(id) {
    return 'stream_' + id;
};

exports.initSockets = function(io) {

    var broadcastStream = function(streamId) {
        Stream.getLatest(streamId, 5).then(function(stream) {
            io.sockets. in (streamRoom(streamId)).emit('stream.update', stream);
        }, console.error);
    };

    pluginEvents.on('stream.update', broadcastStream);
};

exports.onSocket = function(log, socket) {

    var sendStream = function(streamId) {
        Stream.getLatest(streamId, 10).then(function(stream) {
            socket.emit('stream.update', stream);
        }, function(err) {
            console.error(err);
        });
    };

    socket.on('stream.get', function(streamId) {
        socket.join(streamRoom(streamId));

        sendStream(streamId);
    });

};