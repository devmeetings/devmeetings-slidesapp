var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PlayerSave = new Schema({
    title: String,
    recordingId: Schema.ObjectId,
    userId: Schema.ObjectId,
    second: Number,
    slide: Schema.Types.Mixed,
    date: Date
});

module.exports = mongoose.model('PlayerSave', PlayerSave);
