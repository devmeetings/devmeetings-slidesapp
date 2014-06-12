var mongoose = require('mongoose');
Schema = mongoose.Schema;

var SlideData = new Schema({
    userId: Schema.ObjectId,
    slideId: Schema.SlideId,
    content: Schema.Types.Mixed
});

SlideData.virtual('date')
    .get(function() {
        return this._id.getTimestamp();
    });

module.exports = mongoose.model('SlideData', SlideData);

