var SlideModel = require('../models/slide');

var Slides = {

    findSlide: function(slideId) {
        return SlideModel.findById(slideId).exec().then(function(data) {
            return data;
        }, function(err) {
            return SlideModel.find({
                "content.id": slideId
            }).then(function(slides) {
                if (slides.length) {
                    return slides[0];
                }
                throw new Error('Not found!');
            });
        });
    },

    upsertSlide: function(slideId, slide) {
        delete slide._id;
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