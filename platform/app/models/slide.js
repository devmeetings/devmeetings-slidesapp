var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SlideSchema = new Schema({
    parentId: Schema.ObjectId,
    content: Schema.Types.Mixed
});

SlideSchema.virtual('date')
    .get(function() {
        return this._id.getTimestamp();
    });

module.exports = mongoose.model('slide', SlideSchema);
