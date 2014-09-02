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
    slides: [{
        task: {
            type: String    
        },
        slideId: {
            type: Schema.Types.ObjectId,
            ref: 'slide'
        },
        name: {
            type: String      
        },
        peopleFinished: [{
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            name: {
                type: String      
            },
            avatar: {
                type: String        
            }
        }]
    }],
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
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        name: {
            type: String      
        },
        avatar: {
            type: String        
        }
    }],
    peopleFinished: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        name: {
            type: String      
        },
        avatar: {
            type: String        
        }
    }]
});

module.exports = mongoose.model('event', Event);


