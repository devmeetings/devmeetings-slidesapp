var slidesave = require('../../controllers/slidesaves');
var liveReload = require('./live-reload');

var lrServer;

exports.init = function (config) {
  lrServer = liveReload(config.livereload_port);
};

exports.onSocket = function (log, socket) {
  socket.on('slidesaves.save', function (data, callback) {
    var slidesaveId = data.slide;

    slidesave.doEdit(socket.request.user._id, slidesaveId, data.stateId, function (err, state) {
      if (err) {
        console.error(err);
      }
      callback(state._id);

      if (data.shouldRefreshPage) {
        lrServer.notifyClientsOnUrl('page/' + slidesaveId, ['index.html']);
      }
    });
  });
};
