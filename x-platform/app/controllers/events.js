var Event = require('../models/event'),
  Slidesave = require('../models/slidesave'),
  Annotations = require('../models/annotations'),
  _ = require('lodash'),
  Q = require('q'),
  logger = require('../../config/logging'),
  yamlReply = require('../services/yaml'),
  crypto = require('crypto');


var onError = function(res) {
  return function(err) {
    logger.error(err);
    res.sendStatus(400);
  };
};

function asSha1(s) {
  var h = crypto.createHash('sha1');
  h.update('' + s);
  return h.digest('hex');
}

var pass = 'Lolololo';

function encrypt(val) {
  var r = '';
  var c = crypto.createCipher('aes128', pass);
  r += c.update(val, 'ascii', 'hex');
  r += c.final('hex');
  return r;
}

function decrypt(val) {
  var r = '';
  var d = crypto.createDecipher('aes128', pass);
  r += d.update(val, 'hex', 'ascii');
  r += d.final('ascii');
  return r;
}

var onDone = function() {};

var eventFields = 'title pin description image order visible shouldRedirectToUnsafe';
var Events = {
  all: function(req, res) {
    Q.when(Event.find({
      removed: {
        $ne: true
      }
    }).select(eventFields).lean().exec()).then(function(events) {
      events.map(function(event) {
        if (!event.pin) {
          return;
        }

        if (req.user && req.user.acl.indexOf('admin:events') > -1) {
          var realPin = event.pin;
          var realId = event._id;
          event.realPin = realPin;
          event.realId = realId;
        }

        event.pin = asSha1(event.pin);
        event._id = new Buffer(encrypt(event._id.toString()) + ':' + event.pin).toString('base64');
      });
      res.send(events);
    }).fail(onError(res)).done(onDone);
  },

  getRealId: function(req, res) {
    var hashedId = req.params.id;
    var pin = asSha1(req.query.pin);

    try {
      var idAndPinStr = new Buffer(hashedId, 'base64').toString('ascii');
      var idAndPin = idAndPinStr.split(':');
      if (idAndPin[1] === pin) {
        res.send(decrypt(idAndPin[0]));
        return;
      }
      res.sendStatus(403);
    } catch (e) {
      logger.error(e);
      res.sendStatus(400);
    }
  },

  userEvents: function(req, res) {
    Q.when(Slidesave.find({
      user: req.params.userId,
      events: {
        $exists: true
      }
    }).select('events').lean().exec()).then(function(events) {
      var eventsIds = _.unique(events.reduce(function(memo, save) {
        return memo.concat(save.events);
      }, []).map(function(e) {
        return e.toString();
      }));

      return Q.when(Event.find({
        removed: {
          $ne: true
        },
        _id: {
          $in: eventsIds
        }
      }).select(eventFields).lean().exec()).then(function(userEvents){
        res.send(userEvents);
      });
    }).fail(onError(res));
  },

  get: function(req, res) {
    var id = req.params.id;

    Q.when(Event.findOne({
      _id: id
    }).lean().exec()).then(function(event) {
      yamlReply(req, res, event, function(event) {
        function removeIdsAndConvertTypes(obj) {
          Object.keys(obj).map(function(name) {
            if (name === '_id' || name === '__v') {
              delete obj[name];
            }
            if (_.isObject(obj[name])) {
              removeIdsAndConvertTypes(obj[name]);
            }
            if (obj[name] && obj[name].getTimestamp) {
              obj[name] = obj[name].toString();
            }
          });
          return obj;
        }
        return removeIdsAndConvertTypes(event);
      });
    }).fail(onError(res)).done(onDone);
  },

  create: function(req, res) {
    var event = req.body;
    delete event._id;
    delete event.__v;


    Event.create(event, function(err, ev) {
      if (err) {
        logger.error(err);
        res.status(400).send(err);
        return;
      }
      res.send(ev);
      return;
    });
  },

  update: function(req, res) {
    var event = req.body;
    delete event._id;
    delete event.__v;

    Q.when(Event.update({
      _id: req.params.id,
    }, event).exec()).then(function(event) {
      res.sendStatus(200);
    }).fail(onError(res));
  },

  remove: function(req, res) {

    Q.when(Event.update({
      _id: req.params.id
    }, {
      $set: {
        removed: true
      }
    }).exec()).then(function(event) {
      res.sendStatus(200);
    }).fail(onError(res));
  },

  changeVisibility: function(req, res) {
    var event = req.params.event;
    var visible = req.params.visible === 'true' ? true : false;

    Q.when(Event.findOneAndUpdate({
      _id: event
    }, {
      $set: {
        visible: visible
      }
    }).lean().exec()).then(function(event) {
      res.sendStatus(200);
    }).fail(onError(res)).done(onDone);
  },

  getAllAnnotations: function(req, res) {
    var eventId = req.params.id;
    Q.when(Event.findOne({
      _id: eventId
    }).lean().exec()).then(function gatherAllAnnotations(event) {
      return _.reduce(event.iterations, function(acc, iteration) {
        return acc.concat(_.reduce(iteration.materials, function(subacc, material) {
          return subacc.concat(material.annotations);
        }, []));
      }, []);
    }).then(function fetchFromDb(annotations) {
      return Q.when(Annotations.find({
        _id: {
          $in: annotations
        }
      }).exec());
    }).then(function sendResponse(annos) {
      res.send(annos.reduce(function(memo, a) {
        return memo.concat(a.annotations);
      }, []));
    }).done(onDone);
  },

  getAnnotations: function(req, res) {
    var id = req.params.annotationId;
    if (!id || id === 'undefined') {
      return res.send([]);
    }
    Events._findAnnotation(id).then(function(anno) {
      res.send(anno.annotations);
    }).done(onDone);
  },

  _findEventAndMaterial: function(eventId, iterationIdx, materialId) {
    return Q.when(Event.findOne({
      _id: eventId
    }).exec()).then(function(ev) {
      var material = _.map(ev.iterations[iterationIdx].materials, function(x) {
        return x._id.toString();
      }).indexOf(materialId);
      material = ev.iterations[iterationIdx].materials[material];

      if (!material) {
        throw new Error('Material not found');
      }
      return [ev, material];
    });
  },

  _findAnnotation: function(annotationId) {
    return Q.when(Annotations.findById(annotationId).exec());
  },

  annotationCreate: function(req, res) {
    var eventId = req.params.event;
    var iterationIdx = req.params.iteration;
    var materialId = req.params.material;

    Events._findEventAndMaterial(eventId, iterationIdx, materialId).then(function(data) {
      var material = data[1];

      return Q.when(Annotations.findOneAndUpdate({
        _id: material.annotations
      }, {
        $push: {
          'annotations': req.body
        }
      }).lean().exec());

    }).fail(onError(res)).done(function(data) {
      res.send(data);
    });
  },

  annotationEdit: function(req, res) {
    var eventId = req.params.event;
    var iterationIdx = req.params.iteration;
    var materialId = req.params.material;
    var annotationId = req.params.id;

    Events._findEventAndMaterial(eventId, iterationIdx, materialId).then(function(data) {
      var material = data[1];

      return Events._findAnnotation(material.annotations).then(function(anno) {
        var annoIdx = _.map(anno.annotations, function(x) {
          return x._id.toString();
        }).indexOf(annotationId);

        var annotation = anno.annotations[annoIdx];
        _.each(req.body, function(val, k) {
          annotation[k] = val;
        });
        return Q.ninvoke(anno, 'save');
      });

    }).fail(onError(res)).done(function(data) {
      res.send(data);
    });
  }


};

module.exports = Events;
