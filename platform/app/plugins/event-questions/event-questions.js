var Question = require('../../models/question'),
    Slidesave = require('../../models/slidesave'),
    Slide = require('../../models/slide'),
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
        var s = socket;

        var doCreateQuestion = function() {
            Q.ninvoke(Question, 'create', data).then(function (question) {
                res(question);
                io.sockets.emit('event.questions.new', question);
            });
        };

        if (!data.baseSlide) {
            doCreateQuestion();  
            return;
        }
    
        Q.ninvoke(Slidesave.findOne({
            user: socket.handshake.user._id,
            baseSlide: data.baseSlide
        }).lean(), 'exec').then(function (slidesave) {
            if (slidesave) {
                return slidesave;
            }
            return Q.ninvoke(Slide.findOne({
                _id: slide
            }).lean(), 'exec').then(function (slide) {
                var toInsert = {
                    user: socket.handshake.user._id,
                    slide: slide.content,
                    title: data.title,
                    baseSlide: slide._id,
                    timestamp: new Date()
                };
                return Q.ninvoke(Slidesave, 'create', toInsert);
            });
        }).then(function (slidesave) {
            delete slidesave._id;
            delete slidesave.baseSlide;
            slidesave.timestamp = new Date();
            slidesave.title = data.title;
            return Q.ninvoke(Slidesave, 'create', slidesave);
        }).then(function (slidesave) {
            delete data.baseSlide;
            data.slidesave = slidesave._id;
            doCreateQuestion();
        }).fail(log).done(function () {});

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

