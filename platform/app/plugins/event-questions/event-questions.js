var Question = require('../../models/question'),
    Q = require('q');

exports.onSocket = function (log, socket, io) {
        
    var getAllQuestions = function (data, res) {
        Q.ninvoke(Question.find({
            event: data.event
        }).lean(), 'exec').then(function (questions) {
            res(questions);
        });
    };
    
    var createQuestion = function (data, res) {
        Q.ninvoke(Question, 'create', data).then(function (question) {
            res(question);
            io.sockets.emit('event.questions.new', question);
        });
    };

    var createComment = function (data, res) {
        Q.ninvoke(Question.findOneAndUpdate({
            _id: data.question,
        }, {
            $push: {
                comments: data.comment
            }
        }).lean(), 'exec').then(function (question) {
            res('ok');
            io.sockets.emit('event.questions.comment.new', question);
        });
    };


    socket.on('event.questions.all', getAllQuestions);
    socket.on('event.questions.create', createQuestion);
    socket.on('event.questions.comment.create', createComment);
};

