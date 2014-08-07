var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Observe = new Schema({
    observer: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    observed: [{
        name: {
            type: String
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        avatar: {
            type: String        
        }
    }]
});

module.exports = mongoose.model('observe', Observe);


