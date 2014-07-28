var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Event = new Schema({
    title: String,
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
    people: [{
        mail: {
            type: String      
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    }]
});

module.exports = mongoose.model('event', Event);


