var RecordingModel = require('../models/recording');

var Recordings = {
  list: function(req, res) {
    RecordingModel.find({}, '_id title group date', function(err, recordings) {
      if (err) {
        console.error(err);
        res.send(404, err);
        return;
      }
      res.send(recordings);
    });
  },
  get: function(req, res) {
    RecordingModel.findOne({
      _id: req.params.id
    }, function(err, recordings) {
      if (err) {
        console.error(err);
        res.send(404, err);
        return;
      }
      res.send(recordings);
    });
  },
  autoAnnotations: function(req, res) {
    RecordingModel.findOne({
      _id: req.params.id
    }, function(err, recording) {
      if (err) {
        console.error(err);
        res.send(404, err);
        return;
      }

      //var jslint = require('jslint');
      var yaml = require('js-yaml');

      var start = {
        annotations: [],
        active: null,
        url: null
      };

      function pushAnno(memo, slide, description) {
        description = description || '';
        memo.annotations.push({
          description: description,
          timestamp: (slide.timestamp - 500) / 1000,
          type: 'comment'
        });
      }

      var annotations = recording.slides.reduce(function(memo, slide) {

        if (slide.code.workspace.active !== memo.active) {
          pushAnno(memo, slide);
          memo.active = slide.code.workspace.active;
        } else if (slide.code.workspace.url !== slide.url) {
          pushAnno(memo, slide);
          slide.url = slide.code.workspace.url;
        }

        return memo;

      }, start).annotations.sort(function(a, b) {
        return a.timestamp - b.timestamp;
      });

      res.header('Content-Type', 'application/yaml');
      res.send(yaml.safeDump({
        annotations: annotations
      }));
    });
  },
  split: function(req, res) {
    var cut = req.params.time;

    RecordingModel.findOne({
      _id: req.params.id
    }, function(err, recording) {
      if (err) {
        throw err;
      }
      var newModel = {
        title: recording.title + " from " + cut,
        group: recording.group,
        date: recording.date
      };
      // Split slides
      var slides = splitSlides(recording.slides, cut * 1000);
      recording.slides = slides.before;
      newModel.slides = slides.after;

      recording.save();
      RecordingModel.create(newModel).then(function(newModel) {
        res.send(newModel);
      }).then(null, function(err) {
        res.send(400, err);
      });
    });
  },
  cutout: function(req, res) {
    var from = req.params.from * 1000;
    var to = req.params.to * 1000;

    RecordingModel.findOne({
      _id: req.params.id
    }, function(err, recording) {
      if (err) {
        throw err;
      }
      var newModel = {
        title: recording.title + " backup",
        group: recording.group,
        date: recording.date,
        slides: recording.slides.slice()
      };
      recording.slides = cutoutSlides(recording.slides, from, to);
      recording.save();
      RecordingModel.create(newModel).then(function(newModel) {
        res.send(newModel);
      }).then(null, function(err) {
        res.send(400, err);
      });
    });
  }
};

function cutoutSlides(slides, from, to) {
  var before = slides.filter(function(x) {
    return x.timestamp <= from;
  });

  var after = slides.filter(function(x) {
    return x.timestamp >= to;
  });
  // Fix timestamps
  var first = after[0];
  if (first) {
    after = after.map(function(x) {
      x.timestamp -= to - from;
      return x;
    });
  }
  return before.concat(after);
}


function splitSlides(slides, split) {
  var before = slides.filter(function(x) {
    return x.timestamp <= split;
  });
  var after = slides.filter(function(x) {
    return x.timestamp > split;
  });
  // Fix timestamps
  var first = after[0];
  if (first) {
    after = after.map(function(x) {
      x.timestamp -= first.timestamp;
      return x;
    });
  }
  return {
    before: before,
    after: after
  };
}


module.exports = Recordings;
