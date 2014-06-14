var mongoose = require('mongoose');
Schema = mongoose.Schema;

var StreamItemSchema = new Schema({
    userId: String,
    streamId: String,
    message: String,
    type: String,
    data: Schema.Types.Mixed,
    timestamp: Date
});


module.exports = mongoose.model('StreamItem', StreamItemSchema);