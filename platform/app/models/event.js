var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Event = new Schema({
    title: String,
    image: String,
    order: Number,
    description: String,
    visible: Boolean,

    chapters: [{
        title: String,
        audio: Schema.Types.ObjectId,
        todos: [Schema.Types.ObjectId],
        available: Boolean
    }],
    audios: [{
        title: String,
        description: String,
        src: String,
        recording: {
            type: Schema.Types.ObjectId,
            ref: 'recording'
        }
    }],
    todos: [{
        title: String,
        description: String,
        url: String
    }],
    baseSlide: {
        type: Schema.Types.ObjectId,
        ref: 'slide'
    },
    snippets: [{
        title: String,
        timestamp: Number,
        markdown: String
    }]
});

module.exports = mongoose.model('event', Event);


