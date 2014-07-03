var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Event = new Schema({
    title: String,
    date: Date,
    description: String,
    trainer: String,
    peopleLimit: Number,
    people: [String]
});

module.exports = mongoose.model('Event', Event);


