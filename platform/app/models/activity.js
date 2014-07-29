var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Activity = {
    owner: {
        name: {
            type: String,
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
                'microtask.done']
    },
    data: {
        type: Schema.Types.Mixed      
    }
};
