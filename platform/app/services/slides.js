var SlideModel = require('../models/slide');

var Slides = {

    upsertSlide: function(slideId, slide) {
        return SlideModel.findByIdAndUpdate(slideId, slide, {
            upsert: true
        }).exec();
    },

    commitSlide: function(parentId, slideContent) {
        return SlideModel.create({
            parentId: parentId,
            content: slideContent
        });
    }
};




module.exports = Slides;