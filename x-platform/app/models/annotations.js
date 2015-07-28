var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Annotations = new Schema({
  annotations: [{
    title: String,
    description: String,
    timestamp: Number,
    type: {
      type: String,
      enum: ['snippet', 'issue', 'task', 'comment', 'pause']
    },
    meta: String
  }]

});

module.exports = mongoose.model('annotations', Annotations);
