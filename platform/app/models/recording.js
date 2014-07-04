var mongoose = require('mongoose');
Schema = mongoose.Schema;

var Recording = new Schema({
    title: String,
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

Recording.virtual('date')
    .get( function () {
        return this._id.getTimestamp();
    });

Recording.formage = {
    list: ['title', 'videoUrl']
};

module.exports = mongoose.model('Recording', Recording);

