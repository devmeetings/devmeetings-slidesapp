var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Recording = new Schema({
  title: String,
  group: String,
  playbackRate: Number,
  layout: {
    name: String,
    options: Schema.Types.Mixed
  },
  date: Date,
  slides: {
    type: [Schema.Types.Mixed /*Like statesave*/],
    editable: false
  }
});

Recording.formage = {
  list: ['date', 'title']
};

module.exports = mongoose.model('recording', Recording);
