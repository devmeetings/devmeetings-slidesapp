var Slides = require('../../services/slides');

exports.onSocket = function (log, socket) {
  var onPutSlide = function (data, res) {
    var slideId = data._id;
    delete data._id;

    Slides.upsertSlide(slideId, data).then(res, function (err) {
      log.error(err);
    });

  };

  socket.on('slide.edit.put', onPutSlide);

};
