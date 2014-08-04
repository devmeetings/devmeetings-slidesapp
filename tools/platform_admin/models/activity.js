var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Activity = new Schema({
    owner: {
        name: {
            type: String
        },
        mail: {
            type: String    
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    },
    type: {
        type: String,
        enum: ['event.signup',
                'deck.start',
                'deck.finish',
                'slide.enter',
                'video.enter',
                'microtask.done']
    },
    data: {
        type: Schema.Types.Mixed      
    }
});

module.exports = mongoose.model('activity', Activity);
