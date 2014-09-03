var mongoose = require('mongoose');
Schema = mongoose.Schema;

var Recording = new Schema({
    title: String,
    group: String,
    date: Date,
    slides: {
        type: [Schema.Types.Mixed],
        editable: false
    }
});

Recording.formage = {
    list: ['date', 'title']
};

module.exports = mongoose.model('recording', Recording);