var slidesave = require('../../controllers/slidesaves');

exports.onSocket = function(log, socket) {
  socket.on('slidesaves.save', function(data, callback) {
  	console.log(socket.handshake.user);
    slidesave.doEdit(socket.handshake.user._id, data.slide, data.data, callback);
  });
};