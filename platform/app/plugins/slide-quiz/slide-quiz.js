function toAnswer(body) {
    return {
        taskId: body.taskId,
        slide: body.slideId,
        email: body.email,
        nick: body.nick,
        description: body.description,
        content: body.content,
        timestamp: new Date()
    };
}


exports.initApi = function(prefix, app, authenticated) {
    app.post(prefix + "quiz", authenticated, function(req, res) {
        QuizAnswers.create(req.body.quizId, toAnswer(req.body)).then(function(obj) {
            res.send(200, obj._id.toString());
        }).then(null, function(err) {
            console.error(err);
            res.send(400, err);
        });
    });

    app.post(prefix + "quiz/:id", authenticated, function(req, res) {
        QuizAnswers.addAnswer(req.params.id, toAnswer(req.body)).then(function(id) {
            res.send(200, id.toString());
        }, function(err) {
            console.error(err);
            res.send(400, err);
        });
    });


    app.get(prefix + "quizAnswers/:id", authenticated, function(req, res) {
        console.log(req.params.id);
        QuizAnswers.getByQuizId(req.params.id).then(function(answers) {
            res.send(answers);
        }).then(null, function(err) {
            console.error(err);
            res.send(400, err);
        });
    });
};


var QuizAnswer = require('../../models/quizanswer.js');
var QuizAnswers = {
    getByQuizId: function(quizId) {
        return QuizAnswer.find({
            quizId: quizId
        }).exec();
    },
    findById: function(id) {
        return QuizAnswer.findById(id).exec();
    },
    addAnswer: function(id, answer) {
        return this.findById(id).then(function(quiz) {
            quiz.answers.push(answer);
            quiz.lastTask = answer.slide;

            quiz.save();
            return quiz._id;
        });
    },
    create: function(quizId, answer) {
        var quizAnswer = {
            quizId: quizId,
            timestamp: new Date(),
            lastTask: answer.slide,
            answers: [answer]
        };
        return QuizAnswer.create(quizAnswer);
    }
};