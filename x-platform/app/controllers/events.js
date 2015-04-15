var Event = require('../models/event'),
  Slidesave = require('../models/slidesave'),
  Annotations = require('../models/annotations'),
  _ = require('lodash'),
  Q = require('q'),
  yamlReply = require('../services/yaml');


var onError = function(res) {
  return function(err) {
    console.error(err);
    res.send(400);
  };
};

var onDone = function() {};

var Events = {
  all: function(req, res) {
    Q.ninvoke(Event.find({
      removed: {
        $ne: true
      }
    }).select('title description image order visible').lean(), 'exec').then(function(events) {
      res.send(events);
    }).fail(onError(res)).done(onDone);
  },

  userEvents: function(req, res) {
    Q.ninvoke(Slidesave.find({
      user: req.params.userId,
      events: {
        $exists: true
      }
    }).select('events').lean(), 'exec').then(function(events) {
      var eventsIds = _.unique(events.reduce(function(memo, save) {
        return memo.concat(save.events);
      }, []).map(function(e) {
        return e.toString();
      }));
      res.send(eventsIds);
    }).fail(onError(res));
  },

  get: function(req, res) {
    var id = req.params.id;

    Q.ninvoke(Event.findOne({
      _id: id
    }).lean(), 'exec').then(function(event) {
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
        console.error(err);
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

    Q.ninvoke(Event.update({
      _id: req.params.id,
    }, event), 'exec').then(function(event) {
      res.send(event);
    }).fail(onError(res));
  },

  remove: function(req, res) {

    Q.ninvoke(Event.update({
      _id: req.params.id
    }, {
      $set: {
        removed: true
      }
    }), 'exec').then(function(event) {
      res.send(event);
    }).fail(onError(res));
  },

  changeVisibility: function(req, res) {
    var event = req.params.event;
    var visible = req.params.visible === 'true' ? true : false;

    Q.ninvoke(Event.findOneAndUpdate({
      _id: event
    }, {
      $set: {
        visible: visible
      }
    }).lean(), 'exec').then(function(event) {
      res.send(200);
    }).fail(onError(res)).done(onDone);
  },

  getAllAnnotations: function(req, res) {
    var eventId = req.params.id;
    Q.ninvoke(Event.findOne({
      _id: eventId
    }).lean(), 'exec').then(function gatherAllAnnotations(event) {
      return _.reduce(event.iterations, function(acc, iteration) {
        return acc.concat(_.reduce(iteration.materials, function(subacc, material) {
          return subacc.concat(material.annotations);
        }, []));
      }, []);
    }).then(function fetchFromDb(annotations) {
      return Q.ninvoke(Annotations.find({
        _id: {
          $in: annotations
        }
      }), 'exec');
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
    return Q.ninvoke(Event.findOne({
      _id: eventId
    }), 'exec').then(function(ev) {
      var material = _.map(ev.iterations[iterationIdx].materials, function(x) {
        return x._id.toString();
      }).indexOf(materialId);
      material = ev.iterations[iterationIdx].materials[material];

      if (!material) {
        throw new Error("Material not found");
      }
      return [ev, material];
    });
  },

  _findAnnotation: function(annotationId) {
    return Q.ninvoke(Annotations, 'findById', annotationId);
  },

  annotationCreate: function(req, res) {
    var eventId = req.params.event;
    var iterationIdx = req.params.iteration;
    var materialId = req.params.material;

    Events._findEventAndMaterial(eventId, iterationIdx, materialId).then(function(data) {
      var material = data[1];

      return Q.ninvoke(Annotations.findOneAndUpdate({
        _id: material.annotations
      }, {
        $push: {
          'annotations': req.body
        }
      }).lean(), 'exec');

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
