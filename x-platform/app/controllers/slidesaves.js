var Slidesave = require('../models/slidesave'),
  Slide = require('../models/slide'),
  Event = require('../models/event'),
  States = require('../services/states'),
  Q = require('q');


var onError = function(res) {
  return function(err) {
    console.error(err);
    res.sendStatus(400);
  };
};

var onDone = function() {};

var transformToSlidesave = function(slide, user, eventId) {
  return {
    user: user._id,
    slide: slide.content,
    baseSlide: slide._id,
    event: eventId || null,
    title: user.name + ' workspace',
    timestamp: new Date()
  };
};

function updateEvent(slidesave, eventId) {
  Slidesave.update({
    _id: slidesave._id
  }, {
    $push: {
      events: eventId
    }
  }).exec();
}

var Slidesaves = {

  doEdit: function(userId, slide, stateId, callback) {
    States.createFromId(stateId).done(function(state) {
      var edit;
      if (!state) {
        edit = {
          statesaveId: null
        };
      } else {
        edit = {
          statesaveId: stateId,
          slide: state
        };
      }
      Slidesave.findOneAndUpdate({
        user: userId,
        _id: slide
      }, {
        $set: edit
      }).lean().exec(callback);
    });
  },

  create: function(req, res) {
    req.body.user = req.user._id;
    Q.ninvoke(Slidesave, 'create', req.body).then(function(slidesave) {
      res.send({
        slidesave: slidesave._id
      });
    }).fail(onError(res)).done(onDone);
  },

  all: function(req, res) {
    Q.ninvoke(Slidesave.find({
      user: req.user._id
    }).select('title timestamp baseSlide').lean(), 'exec').then(function(slidesaves) {
      res.send(slidesaves);
    }).fail(onError(res)).done(onDone);
  },

  get: function(req, res) {
    var slide = req.params.slide;

    Q.ninvoke(Slidesave.findOne({
      _id: slide
    }).lean(), 'exec').then(function(slidesave) {
      res.send(slidesave);
    }).fail(onError(res)).done(onDone);
  },

  delete: function(req, res) {
    var slide = req.params.slide;

    Q.ninvoke(Slidesave.findOneAndRemove({
      _id: slide
    }).lean(), 'exec').then(function(slidesave) {
      res.send(200);
    }).fail(onError(res)).done(onDone);
  },

  baseSlide: function(req, res) {
    var eventId = req.params.eventId;

    Q.ninvoke(Event.findById(eventId).lean(), 'exec').then(function(event) {
      var slide = event.baseSlide;

      return Q.ninvoke(Slidesave.findOne({
        user: req.user._id,
        baseSlide: slide
      }).lean(), 'exec').then(function(slidesave) {

        if (slidesave) {
          // TODO [ToDr] Potential race. $addToSet would be nice (but we have older version of mongo)
          if (!slidesave.events || slidesave.events.indexOf(eventId) === -1) {
            updateEvent(slidesave, eventId);
          }
          return slidesave;
        }

        return Q.ninvoke(Slide.findOne({
          _id: slide
        }).lean(), 'exec').then(function(slide) {
          var toInsert = transformToSlidesave(slide, req.user, eventId);
          return Q.ninvoke(Slidesave, 'create', toInsert);
        });

      }).then(function(slidesave) {
        res.send({
          slidesave: slidesave._id
        });
      });
    }).fail(onError(res)).done(onDone);
  }

};


module.exports = Slidesaves;
