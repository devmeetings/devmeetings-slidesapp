var RecordingModel = require('../models/recording');
var states = require('../services/states');
var _ = require('lodash');

function convertRecordingToUnifiedHistoryFormat(recording, filter) {
  'use strict';

  var states = recording.slides;
  delete recording.slides;

  recording.original = states[0].original;
  recording.patches = states.reduce(function(patches, state) {

    var timeDiff = (_.last(patches) || {}).timestamp || 0;
    state.patches.map(function(patch) {
      patch.timestamp += timeDiff;
    });

    // Apply current
    state.patches[0].current = state.original;

    // Udate patches
    return patches.concat(state.patches);
  }, []);

  // [ToDr] Not sure why some old recordings have timestamp 0 at the end
  var len = recording.patches.length;
  if (len > 1 && recording.patches[len - 1].timestamp === 0) {
    recording.patches[len - 1].timestamp = recording.patches[len - 2].timestamp + 1;
  }

  if (filter) {
    recording.patches = recording.patches.filter(function(val, idx){
      return idx % filter === 0;
    });
  }

  return recording;
}


var recordingsFilter = 2;

var Recordings = {
  list: function(req, res) {
    RecordingModel.find({}).select('_id title group date').lean().exec(function(err, recordings) {
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
    }).lean().exec(function(err, recording) {
      if (err || !recording) {
        console.error(err);
        res.send(404, err);
        return;
      }
      var rec = convertRecordingToUnifiedHistoryFormat(recording, recordingsFilter);
      res.setHeader('Cache-Control', 'public, max-age=' + 3600 * 24 * 7);
      res.send(rec);
    });
  },

  autoAnnotations: function(req, res) {
    var format = req.query.format;

    RecordingModel.findOne({
      _id: req.params.id
    }).lean().exec(function(err, rawRecording) {
      if (err) {
        console.error(err);
        res.status(404).send(err);
        return;
      }

      if (!rawRecording || rawRecording.slides.length === 0) {
        res.send([]);
        return;
      }

      var recording = convertRecordingToUnifiedHistoryFormat(rawRecording, recordingsFilter + 1);

      if (!recording.original || !recording.original.workspace) {
        res.send([]);
        return;
      }

      var start = {
        annotations: [],
        active: null,
        timestamp: 0,
        permaUrl: null,
        movement: 0,
        previousNotes: null,
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


      function notesDetected(memo, slide) {
        if (!slide.code.notes) {
          return false;
        }

        var lastNotes = slide.code.notes.split('\n');
        var prevNotes = memo.previousNotes.split('\n');

        // Naive detecting of new line
        if (lastNotes.length === prevNotes.length) {
          return false;
        }

        return lastNotes[lastNotes.length - 2];
      }

      function movementDetected(memo, slide) {
        var workspace = slide.code.workspace;
        var active = workspace.active;
        var tab = workspace.tabs[active];

        if (tab.editor && memo.previousTabData.editor) {
          var isContentSame = tab.content === memo.previousTabData.content;
          var isCursorDifferentColumn = tab.editor.cursorPosition.column !== memo.previousTabData.editor.cursorPosition.column;
          var isCursorDifferentRow = tab.editor.cursorPosition.row !== memo.previousTabData.editor.cursorPosition.row;
          if (isContentSame && (isCursorDifferentColumn || isCursorDifferentRow)) {
            memo.movement++;
          } else {
            memo.movement = 0;
          }
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
        if (Math.abs(lastRow - currentRow) > 10) {
          return true;
        }

        return false;
      }

      var lastIdx = recording.patches.length - 1;
      var annotations = states.reducePatchesContent(recording, function(memo, slide, idx) {
        slide.code = slide.current;
        var workspace = slide.code.workspace;
        var note;

        if (workspace.active !== memo.active) {
          var currentTime = slide.timestamp;
          slide.timestamp = memo.timestamp + 500;
          pushAnno(memo, slide, 'beforeTab: ' + workspace.active + ', ' + memo.active);
          // After the switch
          slide.timestamp = currentTime + 300;
          // [ToDr] prevent removing 
          pushAnno(memo, slide, 'afterTab', '');

          memo.active = workspace.active;
          memo.movement = 0;
        } else if (workspace.permaUrl !== memo.permaUrl) {
          pushAnno(memo, slide, 'urlChange: ' + workspace.permaUrl + ', ' + memo.permaUrl);
          memo.permaUrl = workspace.permaUrl;
          memo.movement = 0;
        } else if (Math.abs(slide.timestamp - memo.timestamp) > 5000) {
          pushAnno(memo, slide, 'longPause: ' + (slide.timestamp - memo.timestamp));
          memo.movement = 0;
        } else if (movementDetected(memo, slide)) {
          pushAnno(memo, slide, 'movement');
          memo.movement = 0;
        } else if (largeJumpDetected(memo, slide)) {
          pushAnno(memo, slide, 'largeJump');
        } else if (notesDetected(memo, slide)) {
          note = notesDetected(memo, slide);
          pushAnno(memo, slide, 'Notes', note);
        } else if (lastIdx === idx) {
          pushAnno(memo, slide, 'last');
        }

        memo.previousTabData = workspace.tabs[workspace.active];
        memo.previousNotes = slide.code.notes;
        memo.timestamp = slide.timestamp;
        return memo;

      }, start).annotations.sort(function(a, b) {
        return a.timestamp - b.timestamp;
      }).reduce(function(memo, anno) {
        if (!memo.length) {
          return [anno];
        }
        var last = memo[memo.length - 1];

        if (Math.abs(last.timestamp - anno.timestamp) > 1.5 || (anno.reason === 'afterTab' && anno.timestamp !== 0)) {
          return memo.concat([anno]);
        }
        return memo;
      }, []);

      if (format === 'yaml') {
        var yaml = require('js-yaml');
        res.header('Content-Type', 'application/yaml');
        res.send(yaml.safeDump({
          annotations: annotations
        }));
        return;
      }
      res.send(annotations);

    });
  }
};

module.exports = Recordings;
