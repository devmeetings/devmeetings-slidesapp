var Statesave = require('../models/statesave');
var recordings = require('../models/recording');
var RecordingsService = require('./recordings');
var autoAnnotations = require('./autoAnnotations');
var cache = require('./cache');

var Q = require('q');
var _ = require('lodash');
var jsondiff = require('jsondiffpatch');

var States = (function () {
  'use strict';
  return {
    generatePatch: function (current, next) {
      return jsondiff.diff(current, next);
    },

    applyPatches: function (current, patchList) {
      patchList.map(function (patchData) {
        jsondiff.patch(current, patchData.patch);
      });
    },

    update: function (data, newPatches) {
      if (data.isNew) {
        data.patches = newPatches;
        data.noOfPatches = newPatches.length;
        return Q.ninvoke(data, 'save').then(function (save) {
          return save[0];
        });
      }

      return Q.when(Statesave.update({
        _id: data._id
      }, {
        $set: {
          originalTimestamp: data.originalTimestamp,
          currentTimestamp: data.currentTimestamp,
          current: data.current,
          workspaceId: data.workspaceId
        },
        $push: {
          patches: {
            $each: newPatches
          }
        },
        $inc: {
          noOfPatches: newPatches.length
        }
      }).lean().exec()).then(function () {
        // Increase currently added patches
        data.noOfPatches += newPatches.length;
        return data;
      });
    },

    fetchStateForWriting: function (id, user) {
      if (id && isRecordingId(id)) {
        // We should rather create fork for recording. But not sure how to do this right now
        return createFork({
          user: user,
          workspaceId: null,
          currentTimestamp: new Date(),
          current: {}
        }).then(function (obj) {
          // We are marking the object as fresh
          // beecause we have no idea what content should be there
          // This will force the client to resend the content
          obj.fresh = true;
          obj.recordingId = id.substr(1);
          return obj;
        });
      }

      return fetchState(id, user).then(function (save) {
        if (save.noOfPatches < 100) {
          return save;
        }
        // Create new item in collection
        return createFork(save);
      });
    },

    fetchForUser: function (userId, limit) {
      return Q.when(Statesave.find({
        user: userId
      }).sort({
        _id: -1
      }).limit(limit).lean().exec());
    },

    getData: function (object, path) {
      return getData(object, preparePath(path));
    },

    reducePatchesContent: function (recording, reduceFunc, initialState) {
      var currentState = initialState;

      // [ToDr] Spit operations to not block event loop!
      var chunks = _.chunk(recording.patches, 15);
      var currentResult = recording.original;

      return chunks.reduce(function (memo, chunk) {
        return memo.then(function (x) {
          return Q.delay(1).then(function () {
            return x;
          });
        }).then(function (currentResult) {
          return chunk.reduce(function (current, patch, idx) {
            // Patch current state
            jsondiff.patch(current, patch.patch);

            // Clone to avoid conflicts
            var state = _.cloneDeep(current);
            // Run reduceFunc and store newState
            currentState = reduceFunc(currentState, {
              timestamp: patch.timestamp,
              current: state
            }, idx);

            return current;
          }, currentResult);
        });
      }, Q.when(currentResult)).then(function () {
        return currentState;
      });
    },

    createFromRecordingId: function (compoundId) {
      function normalizeNo (no) {
        var x = parseInt(no, 10) || 0;
        if (isNaN(x)) {
          x = 0;
        }
        return Math.max(x, 0);
      }

      var parts = compoundId.split('_');
      var recId = parts[0].replace('r', '');
      var slideNo = normalizeNo(parts[1]);
      var patchNo = normalizeNo(parts[2]);

      var query = recordings.findById(recId)
        .select('slides')
        .slice('slides.patches', [0, patchNo + 1])
        .slice('slides', [slideNo, 1])
        .lean();

      return Q.when(query.exec()).then(function (recording) {
        // Because of project we can take only first element and all patches
        var state = recording.slides[0];
        States.applyPatches(state.original, state.patches);
        return state.original;
      });
    },

    createFromId: function (compoundId) {
      return cache.get(compoundId, function (compoundId) {
        if (isRecordingId(compoundId)) {
          return States.createFromRecordingId(compoundId);
        }
        var idParts = compoundId.split('_');
        var id = idParts[0];
        var patchIdx = parseInt(idParts[1], 10) || 0;

        var query = Statesave.findById(id)
          .select('original patches')
          .slice('patches', [0, patchIdx + 1])
          .lean();

        return Q.when(query.exec()).then(function (save) {
          if (!save) {
            return save;
          }
          // Apply patches
          var state = save.original || {};
          States.applyPatches(state, save.patches);

          return state;
        });
      });
    },

    getForWorkspaceId: function (workspaceId) {
      return Q.when(Statesave.find({
        workspaceId: workspaceId,
        noOfPatches: {
          $gte: 1
        }
      }).limit(100).select('current _id previousState currentTimestamp').lean().sort({
        'currentTimestamp': 1
      }).exec());
    },

    getSinceId: function (stateId) {
      return Q.when(Statesave.findById(stateId).select('workspaceId originalTimestamp').lean().exec()).then(function (save) {
        var after = Q.when(fetchHistory(save.workspaceId, {
          $gte: save.originalTimestamp
        }, 100).exec());
        var before = Q.when(fetchHistory(save.workspaceId, {
          $lt: save.originalTimestamp
        }, 10, -1).exec());

        return Q.all([before, after]).then(function (a) {
          return {
            before: a[0].reverse(),
            after: a[1]
          };
        });
      }).then(function (history) {
        var patches = convertHistorySlidesToPatches(history.after);
        var original = history.after[0].original || {};

        return autoAnnotations({
          original: JSON.parse(JSON.stringify(original)),
          patches: patches
        }).then(function (annotations) {
          return {
            history: history.before.concat(history.after).map(function (x) {
              // Remove patches - they would be sent twice
              delete x.patches;
              return x;
            }),
            recording: {
              original: original,
              patches: patches,
              annotations: annotations
            }
          };
        });
      });
    },

    convertToRecording: function (eventId, sinceId, fromTimestamp, toTimestamp) {
      fromTimestamp = parseFloat(fromTimestamp) * 1000 || 0;
      toTimestamp = parseFloat(toTimestamp) * 1000 || 0;

      return Q.when(Statesave.findById(sinceId).lean().exec()).then(function (save) {
        // We cannot use toTimestamp here, because convertion can skip silence
        var others = Q.when(fetchHistory(save.workspaceId, {
          $gt: save.originalTimestamp
        }, 100).exec());

        return others.then(function (items) {
          return [save].concat(items);
        });
      }).then(function (history) {
        var patches = convertHistorySlidesToPatches(history);

        var recordingStartIdx = _.sortedIndex(patches, {
          timestamp: fromTimestamp
        }, 'timestamp');

        var recordingEndIdx = _.sortedIndex(patches, {
          timestamp: toTimestamp
        }, 'timestamp');

        var patchesToApply = patches.slice(0, recordingStartIdx);
        var patchesToStore = patches.slice(recordingStartIdx, recordingEndIdx);

        var saveData = history[0];
        var current = saveData.original || {};
        States.applyPatches(current, patchesToApply);
        var timestampDiff = patchesToApply.length ? _.last(patchesToApply).timestamp : 0;
        var currentTimestamp = new Date(saveData.originalTimestamp + timestampDiff);

        var slides = _.chunk(patchesToStore, 100);

        // Convert to slides format
        slides = slides.map(function (patches) {
          return {
            user: saveData.user,
            workspaceId: saveData.workspaceId,
            original: null,
            originalTimestamp: null,
            current: null,
            currentTimestamp: null,
            noOfPatches: patches.length,
            patches: patches
          };
        });

        // Fix timestamps & original / current
        slides.reduce(function (memo, slide) {
          var current = JSON.parse(JSON.stringify(memo.current));

          slide.original = JSON.parse(JSON.stringify(current));
          slide.originalTimestamp = memo.currentTimestamp;

          // subtract timestamp diff
          slide.patches.map(function (patch) {
            patch.timestamp -= memo.timestampDiff;
          });

          var lastTimestamp = _.last(slide.patches).timestamp;
          // Apply patches
          States.applyPatches(current, slide.patches);

          // Save current
          slide.current = current;
          slide.currentTimestamp = new Date(memo.currentTimestamp.getTime() + lastTimestamp);

          memo.timestampDiff += lastTimestamp;
          memo.current = current;
          memo.currentTimestamp = slide.currentTimestamp;

          return memo;
        }, {
          current: current,
          currentTimestamp: currentTimestamp,
          timestampDiff: timestampDiff
        });

        return RecordingsService.createRecordingForEvent(eventId, slides);
      });
    },

    skipSilence: skipSilence
  };
}());

module.exports = States;

function isRecordingId (compoundId) {
  'use strict';
  return compoundId[0] === 'r';
}

function fetchHistory (workspaceId, timestampQuery, limit, sort) {
  'use strict';

  sort = sort || 1;

  return Statesave.find({
    workspaceId: workspaceId,
    noOfPatches: {
      $gte: 1
    },
    originalTimestamp: timestampQuery
  }).lean().limit(limit).sort({
    'originalTimestamp': sort
  });
}

function getTimestamp (x) {
  'use strict';
  return new Date(x).getTime();
}

function convertHistorySlidesToPatches (slides) {
  'use strict';
  var start = getTimestamp(slides[0].originalTimestamp);

  var patches = slides.reduce(function (patches, slide) {
    var diff = getTimestamp(slide.originalTimestamp) - start;
    var slidePatches = slide.patches || [];
    var newPatches = slidePatches.map(function (patch) {
      return {
        id: patch.id,
        timestamp: patch.timestamp + diff,
        patch: patch.patch
      };
    });

    return patches.concat(newPatches);
  }, []);

  skipSilence(patches);

  return patches;
}

function skipSilence (patches) {
  'use strict';

  var silenceThreshold = 1000 * 30;
  var silenceGap = 1000 * 5;
  patches.reduce(function (memo, patch) {
    var diff = patch.timestamp - memo.last;
    if (diff > silenceThreshold) {
      memo.diff += diff - silenceGap;
    }

    memo.last = patch.timestamp;
    patch.timestamp -= memo.diff;
    return memo;
  }, {
    diff: 0,
    last: 0
  });
}

function createFork (state) {
  'use strict';

  var obj = new Statesave({
    user: state.user,
    previousState: state._id,
    workspaceId: state.workspaceId,
    originalTimestamp: state.currentTimestamp,
    original: state.current,
    currentTimestamp: state.currentTimestamp,
    current: JSON.parse(JSON.stringify(state.current)),
    patches: []
  });
  obj.isNew = true;

  return Q.when(obj);
}

function fetchState (id, user) {
  'use strict';

  function newStateSave () {
    var obj = new Statesave({
      user: user._id,
      originalTimestamp: new Date(0),
      noOfPatches: 0,
      original: {},
      current: {}
    });
    obj.isNew = true;
    obj.fresh = true;
    return obj;
  }

  if (id) {
    var query = Statesave
      // TODO [ToDr] This should like below. Test if it doesn't break anything.
      // .findOne({
      //   _id: id,
      //   user: user._id
      // })
      .findById(id)
      .select('_id current currentTimestamp originalTimestamp noOfPatches');

    return Q.when(query.exec()).then(function (save) {
      if (!save) {
        return newStateSave();
      }
      return save;
    });
  }

  var obj = newStateSave();
  return Q.when(obj);
}

function getData (context, path) {
  'use strict';

  if (path.length === 0) {
    return context;
  }
  var part = path[0];
  if (context[part]) {
    return getData(context[part], path.slice(1));
  }
  return null;
}

function preparePath (path) {
  'use strict';

  return path.replace('.', '').split('.');
}
