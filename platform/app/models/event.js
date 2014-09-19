var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Event = new Schema({
    title: String,
    image: String,
    order: Number,
    description: String,
    visible: Boolean,
    
    iterations: [{
        title: String,
        status: String,
        materials: [{
            title: String,
            url: String,
            material: {
                type: Schema.Types.ObjectId,
                ref: 'recording'
            },
            annotations: [{
                title: String,
                description: String,
                timestamp: Number,
                type: {
                    type: String,
                    enum: ['issue', 'task', 'comment']
                }
            }]
        }],
        tasks: [{
            title: String,
            url: String
        }]
    }],

    baseSlide: {
        type: Schema.Types.ObjectId,
        ref: 'slide'
    }

});

module.exports = mongoose.model('event', Event);


