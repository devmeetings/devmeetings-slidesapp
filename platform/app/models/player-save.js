var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PlayerSave = new Schema({
    title: String,
    trainingId: Schema.ObjectId,
    userId: Schema.ObjectId,
    chapter: Number,
    second: Number,
    slide: Schema.Types.Mixed,
    date: Date
});

module.exports = mongoose.model('PlayerSave', PlayerSave);
