var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Never depend on this collection!
 * It can be removed any time and it overwrites itself
 */
var Cache = new Schema({
  key: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  createdAt: Date,
  content: {
    type: Schema.Types.Mixed,
    editable: false,
    required: true
  }
}, {
  capped: {
    size: 500 * 1024 * 1024, //bytes
    max: 15000
  }
});

module.exports = mongoose.model('cache', Cache);
