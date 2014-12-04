var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Slidesave = new Schema({
    channel: {
        type: Schema.Types.Mixed,
        ref: 'channel'
    },
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

