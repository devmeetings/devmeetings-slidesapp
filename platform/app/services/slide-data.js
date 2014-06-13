var SlideDataModel = require('../models/slide-data');

exports.findBySlideIdOrCreate = function (slideId, callback) {
    SlideDataModel.findOne({
        slideId: slideId 
    }).exec().then( function (slideData) {
        if (slideData) {
            slideData.content = slideData.content ? slideData.content : {};
            callback(null, slideData);
            return;
        }

        SlideDataModel.create({
            slideId : slideId,
            content : {}
        }, function (err, slideData) {
            if (err) {
                callback(err);
                return;
            }

            callback(null, slideData);
        });
    });
};

exports.updateSlideData = function (slideData, callback) {
    slideData = slideData.toObject();
    var slideDataId = slideData._id;
    delete slideData._id;

    SlideDataModel.findByIdAndUpdate(slideDataId, slideData, {
        upsert: true
    }, function (err, dbSlideData) {
        if (err) {
            callback(err);
            return;
        }

        callback(null, dbSlideData);
    });
};


