var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventLogs = new Schema({
  eventId: {
    type: String,
    unique: true
  },
  logs: [{
    description: Date,
    date: Date
  }]
});

module.exports = mongoose.model('EventLogs', EventLogs);
