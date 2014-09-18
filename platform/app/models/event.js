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
        todos: [Schema.Types.ObjectId]
    }],
    audios: [{
        title: String,
        description: String,
        src: String,
        recording: {
            type: Schema.Types.ObjectId,
            ref: 'recording'
        },
        available: Boolean
    }],
    todos: [{
        title: String,
        description: String,
        baseSlide: {
            type: Schema.Types.ObjectId,
            ref: 'slide'
        },
        available: Boolean
    }],
    snippets: [{
        title: String,
        timestamp: Number,
        markdown: String
    }]
});

module.exports = mongoose.model('event', Event);


