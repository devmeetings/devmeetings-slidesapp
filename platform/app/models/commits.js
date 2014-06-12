var mongoose = require('mongoose');
Schema = mongoose.Schema;

var CommitSchema = new Schema({
    userId: Schema.ObjectId,
    message: String,
    type: String,
    data: Schema.Types.Mixed
});

SlideSchema.virtual('date')
    .get(function() {
        return this._id.getTimestamp();
    });

module.exports = mongoose.model('Commit', CommitSchema);