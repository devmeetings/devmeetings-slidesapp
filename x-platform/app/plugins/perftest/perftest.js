exports.onSocket = function (log, socket, io) {
  'use strict';

  socket.on('perfTest.start', function (text) {
    log('Starting performance test');
    socket.broadcast.emit('perfTest.start', text);
  });

  socket.on('perfTest.stop', function () {
    log('Stopping performance test');
    socket.broadcast.emit('perfTest.stop');
  });

  socket.on('perfTest.sendResults', function () {
    log('Sending results');
    socket.broadcast.emit('perfTest.sendResults');
  });
};
