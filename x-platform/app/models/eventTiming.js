var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventTiming = new Schema({
  eventTitle: String,
  id: {
    type: String,
    unique: true
  },
  eventDate: Date,
  authorId: String,
  items: [{
    title: String,
    icon: String,
    time: Number,
    startedAt: Date,
    finishedAt: Date
  }]
});

module.exports = mongoose.model('EventTiming', EventTiming, 'eventTiming');
