var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SpeedDating = new Schema({
    username: String,
    updated: { type: Date, default: Date.now },
    answeredCalls: Schema.Types.Mixed,
    deck: String,
    slide: String
});

module.exports = mongoose.model('SpeedDating', SpeedDating);