var mongoose = require('mongoose');
Schema = mongoose.Schema;

var StreamItemSchema = new Schema({
    userId: Schema.ObjectId,
    deckId: Schema.ObjectId,
    message: String,
    type: String,
    data: Schema.Types.Mixed
});

StreamItemSchema.virtual('date')
    .get(function() {
        return this._id.getTimestamp();
    });

module.exports = mongoose.model('StreamItem', StreamItemSchema);