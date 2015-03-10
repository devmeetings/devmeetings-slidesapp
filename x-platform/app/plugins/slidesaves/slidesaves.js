var slidesave = require('../../controllers/slidesaves');

exports.onSocket = function(log, socket) {
  socket.on('slidesaves.save', function(data, callback) {
    slidesave.doEdit(socket.handshake.user._id, data.slide, data.data, callback);
  });
};
