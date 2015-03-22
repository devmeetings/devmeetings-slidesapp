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
        timestamp: 0,
        url: null,
        movement: 0,
        previousContent: ''
      };

      function pushAnno(memo, slide, description) {
        description = description || '';
        memo.annotations.push({
          description: description,
          timestamp: Math.max(0, (slide.timestamp - 1000) / 1000),
          type: 'comment'
        });
      }

      function movementDetected(memo, slide) {
        var workspace = slide.code.workspace;
        var active = workspace.active;
        var tab = workspace.tabs[active];

        if (tab.content === memo.previousContent) {
          memo.movement++;
        } else {
          memo.movement = 0;
        }
        
        if (memo.movement > 5) {
          return true;
        }
        return false;
      }

      var lastIdx= recording.slides.length - 1;
      var annotations = recording.slides.reduce(function(memo, slide, idx) {
        var workspace = slide.code.workspace;

        if (workspace.active !== memo.active) {
          pushAnno(memo, slide);
          memo.active = workspace.active;
          memo.movement = 0;
        } else if (workspace.url !== slide.url) {
          pushAnno(memo, slide);
          slide.url = workspace.url;
          memo.movement = 0;
        } else if (Math.abs(slide.timestamp - memo.timestamp) > 3000) {
          pushAnno(memo, slide);
          memo.movement = 0;
        } else if (movementDetected(memo, slide)) {
          pushAnno(memo, slide);
          memo.movement = 0;
        } else if (lastIdx === idx) {
          pushAnno(memo, slide);
        }

        memo.previousContent = workspace.tabs[workspace.active].content;
        memo.timestamp = slide.timestamp;
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
