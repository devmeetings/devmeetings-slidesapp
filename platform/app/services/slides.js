var SlideModel = require('../models/slide');

var Slides = {

    upsertSlide: function(slideId, slide) {
        return SlideModel.findByIdAndUpdate(slideId, slide, {
            upsert: true
        }).exec();
    }
};




module.exports = Slides;