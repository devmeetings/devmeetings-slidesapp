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
    statesaveId: String,
    slide: {
        type: Schema.Types.Mixed
    },
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'events'
    }],
    title: String,
    timestamp: Date
});

module.exports = mongoose.model('slidesave', Slidesave);

