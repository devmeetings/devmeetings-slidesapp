var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Question = new Schema({
  title: String,
  description: String,
  comments: [{
    text: String,
    timestamp: Date,
    slidesave: {
      type: Schema.Types.ObjectId,
      ref: 'slidesave'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  }],
  timestamp: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'event'
  },
  slidesave: {
    type: Schema.Types.ObjectId,
    ref: 'slidesave'
  }
});

module.exports = mongoose.model('question', Question);
