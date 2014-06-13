var mongoose = require('mongoose');
Schema = mongoose.Schema;

var SlideData = new Schema({
    slideId: Schema.ObjectId,
    content: Schema.Types.Mixed
});

SlideData.virtual('date')
    .get(function() {
        return this._id.getTimestamp();
    });

module.exports = mongoose.model('SlideData', SlideData);

