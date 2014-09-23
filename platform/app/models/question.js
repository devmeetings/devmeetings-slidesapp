var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Question = new Schema({
    title: String,
    description: String,
    comments: [String],
    timestamp: Date,
    event: {
        type: Schema.Types.ObjectId,
        ref: 'event'
    }
});

module.exports = mongoose.model('question', Question);

