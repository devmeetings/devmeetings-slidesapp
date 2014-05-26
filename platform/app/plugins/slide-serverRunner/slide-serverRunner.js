exports.onSocket = function(log, socket, io) {

    socket.on('serverRunner.code.run', function(data, callback) {

        console.log(data);

    });
};