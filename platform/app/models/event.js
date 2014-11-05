var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Event = new Schema({
    title: String,
    image: String,
    order: Number,
    description: String,
    visible: Boolean,
    intro: {
        type: Schema.Types.ObjectId,
        ref: "slides"
    },
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
            deck: {
                deck: {
                    type: Schema.Types.ObjectId,
                    ref: 'decks'
                },
                from: {
                    type: Schema.Types.ObjectId,
                    ref: 'slides'
                },
                to: {
                    type: Schema.Types.ObjectId,
                    ref: 'slides'
                }
            },
            annotations: [{
                title: String,
                description: String,
                timestamp: Number,
                type: {
                    type: String,
                    enum: ['snippet', 'issue', 'task', 'comment']
                },
                meta: String
            }]
        }],
        tasks: [{
            title: String,
            url: String
        }]
    }],

    rankingLink: String,
    ranking: {
        people: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            name: String,
            avatar: String,
            tasks: Schema.Types.Mixed
        }]
    },

    baseSlide: {
        type: Schema.Types.ObjectId,
        ref: 'slide'
    }

});

module.exports = mongoose.model('event', Event);