var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SurveyAnswer = new Schema({
    answers: [],
    payment: Number,
    email: String,
    clientId: String
});

module.exports = mongoose.model('SurveyAnswer', SurveyAnswer);