var SlideModel = require('../../models/slide');


exports.onSocket = function (log, socket) {
    
    var onPutSlide = function (data, res) {
        console.log("DATA: ", data);
        var slideId = data._id;
        delete data._id;

        SlideModel.findByIdAndUpdate(slideId, data, { upsert: true }, function (err, slide) {
            if (err) {
                console.error(err);
                return;
            }
        });
    };

    socket.on('slide.edit.put', onPutSlide);

};
