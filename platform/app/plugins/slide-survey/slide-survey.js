var SurveyAnswer = require('./SurveyAnswer');

exports.onSocket = function(log, socket) {

    socket.on('survey.submit', function(data, callback) {
        console.log(data);
        data.clientId = socket.id;
        var answers = new SurveyAnswer(data);
        answers.save(callback);
    });

};