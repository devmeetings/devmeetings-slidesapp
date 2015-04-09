var slidesave = require('../../controllers/slidesaves');

exports.onSocket = function(log, socket) {
  socket.on('slidesaves.save', function(data, callback) {
    slidesave.doEdit(socket.request.user._id, data.slide, data.stateId, function(err, state) {
      callback(state._id);
    });
  });
};
