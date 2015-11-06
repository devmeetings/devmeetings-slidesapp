var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Latency = new Schema({
  clientId: String,
  date: Date,
  event: String,
  data: Number
});

module.exports = mongoose.model('latency', Latency);
