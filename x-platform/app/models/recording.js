var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Statesave = require('./statesave');

var Recording = new Schema({
    title: String,
    group: String,
    layout: {
      name: String,
      options: Schema.Types.Mixed
    },
    date: Date,
    slides: {
        type: [Statesave],
        editable: false
    }
});

Recording.formage = {
    list: ['date', 'title']
};

module.exports = mongoose.model('recording', Recording);
