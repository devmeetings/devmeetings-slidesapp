var mongoose = require('mongoose');
Schema = mongoose.Schema;

var Recording = new Schema({
    title: String,
    group: String,
    date: Date,
    videoUrl: String,
    timeOffset: Number,
    slideId: String,
    chapters: [{
        timestamp: Number,
        end: Number,
        name: String
    }],
    slides: {
        type: [Schema.Types.Mixed],
        editable: false
    }
});

Recording.formage = {
    list: ['date', 'title', 'videoUrl']
};

module.exports = mongoose.model('recording', Recording);

