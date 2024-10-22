var Question = require('../../models/question');
var Slidesave = require('../../models/slidesave');
var Slide = require('../../models/slide');
var Q = require('q');

exports.onSocket = function (log, socket, io) {
  var getAllQuestions = function (data, res) {
    Q.when(Question.find({
      event: data.event
    }).populate('user comments.user').lean().exec()).then(function (questions) {
      res(questions);
    });
  };

  var createQuestion = function (data, res) {
    var doCreateQuestion = function () {
      data.user = socket.request.user._id;

      Q.when(Question.create(data)).then(function (question) {
        res(question);
        io.sockets.emit('event.questions.new', question);
      });
    };

    if (!data.baseSlide) {
      doCreateQuestion();
      return;
    }

    Q.when(Slidesave.findOne({
      user: socket.request.user._id,
      baseSlide: data.baseSlide
    }).lean().exec()).then(function (slidesave) {
      if (slidesave) {
        return slidesave;
      }
      return Q.when(Slide.findOne({
        _id: data.baseSlide
      }).lean().exec()).then(function (slide) {
        var toInsert = {
          user: socket.request.user._id,
          slide: slide.content,
          title: 'default workspace',
          baseSlide: slide._id,
          timestamp: new Date()
        };
        return Q.when(Slidesave.create(toInsert));
      });
    }).then(function (slidesave) {
      delete slidesave._id;
      delete slidesave.baseSlide;
      slidesave.timestamp = new Date();
      slidesave.title = data.description;
      return Q.when(Slidesave.create(slidesave));
    }).then(function (slidesave) {
      delete data.baseSlide;
      data.slidesave = slidesave._id;
      doCreateQuestion();
    }).fail(log).done(function () {});
  };

  var createComment = function (data, res) {
    var createComment = function () {
      data.comment.user = socket.request.user._id;
      data.comment.timestamp = new Date();

      return Q.when(Question.findOneAndUpdate({
        _id: data.question
      }, {
        $push: {
          comments: data.comment
        }
      }).lean().exec()).then(function (question) {
        res('ok');
        io.sockets.emit('event.questions.comment.new', question);
      });
    };

    if (!data.save) {
      createComment().fail(log);
      return;
    }

    delete data.save._id;
    Q.when(Slidesave.create(data.save)).then(function (slidesave) {
      data.comment.slidesave = slidesave._id;
      delete data.comment.statesaveId;
      return createComment();
    }).fail(log).done(function () {});
  };

  socket.on('event.questions.all', getAllQuestions);
  socket.on('event.questions.create', createQuestion);
  socket.on('event.questions.comment.create', createComment);
};
