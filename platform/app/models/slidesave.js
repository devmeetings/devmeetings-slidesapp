var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Slidesave = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    baseSlide: {
        type: Schema.Types.ObjectId,
        ref: 'slide'
    },
    slide: {
        type: Schema.Types.Mixed
    },
    title: String,
    timestamp: Date
});

module.exports = mongoose.model('slidesave', Slidesave);

