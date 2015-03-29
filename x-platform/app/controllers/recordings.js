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
        previousTabData: {
          content: '',
          editor: null
        }
      };

      function pushAnno(memo, slide, reason, description) {
        description = description || '';
        var anno = {
          description: description,
          timestamp: Math.max(0, (slide.timestamp - 1300) / 1000),
          type: 'comment',
        };
        if (reason) {
          anno.reason = reason;
        }
        memo.annotations.push(anno);
      }

      function movementDetected(memo, slide) {
        var workspace = slide.code.workspace;
        var active = workspace.active;
        var tab = workspace.tabs[active];

        if (tab.content === memo.previousTabData.content) {
          memo.movement++;
        } else {
          memo.movement = 0;
        }
        
        if (memo.movement > 5) {
          return true;
        }
        return false;
      }

      function largeJumpDetected(memo, slide) {
        var workspace = slide.code.workspace;
        var active = workspace.active;
        var tab = workspace.tabs[active];

        function getRow(tab) {
          if (!tab.editor || !tab.editor.cursorPosition) {
            return null;
          }
          return tab.editor.cursorPosition.row;
        }

        var lastRow = getRow(memo.previousTabData);
        var currentRow = getRow(tab);
  
        // TODO [ToDr] Amount choose after some serious big data analysisi ;)
        if (Math.abs( lastRow - currentRow ) > 10) {
          return true;
        }

        return false;
      }

      var lastIdx= recording.slides.length - 1;
      var annotations = recording.slides.reduce(function(memo, slide, idx) {
        var workspace = slide.code.workspace;

        if (workspace.active !== memo.active) {
          slide.timestamp -= 1000;
          pushAnno(memo, slide, 'beforeTab');
          // After the switch
          slide.timestamp += 1300;
          // [ToDr] prevent removing 
          pushAnno(memo, slide, 'afterTab', '');

          memo.active = workspace.active;
          memo.movement = 0;
        } else if (workspace.url !== slide.url) {
          pushAnno(memo, slide, 'urlChange');
          slide.url = workspace.url;
          memo.movement = 0;
        } else if (Math.abs(slide.timestamp - memo.timestamp) > 5000) {
          pushAnno(memo, slide, 'longPause');
          memo.movement = 0;
        } else if (movementDetected(memo, slide)) {
          pushAnno(memo, slide, 'movement');
          memo.movement = 0;
        } else if (largeJumpDetected(memo, slide)) {
          pushAnno(memo, slide, 'largeJump');
        } else if (lastIdx === idx) {
          pushAnno(memo, slide, 'last');
        }

        memo.previousTabData = workspace.tabs[workspace.active];
        memo.timestamp = slide.timestamp;
        return memo;

      }, start).annotations.sort(function(a, b) {
        return a.timestamp - b.timestamp;
      }).reduce(function(memo, anno) {
        if (!memo.length) {
          return [anno];
        }
        var last = memo[memo.length - 1];

        if (Math.abs(last.timestamp - anno.timestamp) > 1.5 || anno.reason === 'afterTab')  {
          return memo.concat([anno]);
        }
        return memo;
      }, []);

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
