var SlideModel = require('../../models/slide');


exports.onSocket = function (log, socket) {
    
    var onPutSlide = function (data, res) { 
        SlideModel.findByIdAndUpdate(data._id, data, { upsert: true }, function (err, slide) {
            if (err) {
                console.error(err);
                return;
            }
        });
    };

    socket.on('slide.edit.put', onPutSlide);

};
