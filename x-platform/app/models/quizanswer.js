var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var QuizAnswer = new Schema({
    quizId: String,
    timestamp: Date,
    lastTask: {
        type: Schema.Types.ObjectId,
        ref: 'slide'
    },
    answers: [{
        taskId: String,
        slide: {
            type: Schema.Types.ObjectId,
            ref: 'slide'
        },
        email: String,
        nick: String,
        description: String,
        content: Schema.Types.Mixed,
        timestamp: Date
    }]
});

module.exports = mongoose.model('quizanswer', QuizAnswer);