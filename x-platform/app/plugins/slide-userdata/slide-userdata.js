exports.onSocket = function(log, socket) {
  socket.on('getUserData', function() {
    socket.emit('userData',socket.handshake.user);
  });
};