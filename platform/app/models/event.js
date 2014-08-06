var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Event = new Schema({
    title: String,
    type: {
        type: String,
        enum: ['live', 'online', 'video'],
        default: 'live'
    },
    trainingId: {
        type: Schema.Types.ObjectId, 
        ref: 'training'
    },
    technology: String,
    date: Date,
    description: String,
    trainer: {
        name: {
            type: String      
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    },
    peopleLimit: Number,
    peopleStarted: [{
        mail: {
            type: String      
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        name: {
            type: String      
        }
    }],
    peopleFinished: [{
        mail: {
            type: String      
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        name: {
            type: String      
        }
    }]
});

module.exports = mongoose.model('event', Event);


