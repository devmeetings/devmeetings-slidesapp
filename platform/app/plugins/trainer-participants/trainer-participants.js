exports.socketInit = function(log, socket, io) {

    socket.on('trainer.participants.get', function(data, callback) {

        socket.get('deck.current', function(err, deck) {

            var ids = io.sockets.clients(deck).map(function(socket) {
                return socket.id;
            });
            console.log(ids);

            callback(ids);
        });
    });
};