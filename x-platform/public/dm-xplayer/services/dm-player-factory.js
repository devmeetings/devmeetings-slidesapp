define(['_', 'dm-xplayer/dm-xplayer-app'], function(_, xplayerApp) {
  'use strict';

  xplayerApp.factory('dmPlayerFactory', function() {

    function oldRecordingPlayer(recording, callback) {

      var currentTime = 0;
      var currentSnapIdx = 0;

      var getCode = function(index) {
        return recording.slides[index].code;
      };

      var getTime = function(index) {
        return recording.slides[index].timestamp;
      };

      return {
        goToSecond: function(second) {
          var millisecond = second * 1000;
          var index = _.findIndex(recording.slides, function(slide) {
            return slide.timestamp > millisecond;
          });
          if (index === -1) {
            return;
          }

          currentTime = getTime(index);
          currentSnapIdx = index;
          callback(getCode(index));
        }
      };
    }

    function searchForPatches(patches, startS, endS) {
      var startIdx = _.sortedIndex(patches, {
        timestamp: startS * 1000
      }, 'timestamp');

      var endIdx = _.sortedIndex(patches, {
        timestamp: endS * 1000
      }, 'timestamp');

      return patches.slice(startIdx, endIdx);
    }

    function newRecordingPlayer(recording, callback) {
      var player = recording.player;
      var recPatches = recording.patches;

      var lastSecond = -1;

      function callbackWithCode(second) {
        lastSecond = second;
        callback(player.getCurrentState());
      }

      return {
        goToSecond: function(second) {
          var patches;
          // We can just apply patches
          if (lastSecond < second) {
            // Search for patches
            patches = searchForPatches(recPatches, lastSecond, second);
            if (patches.length) {
              player.applyPatchesAndId({
                id: _.last(patches).id,
                patches: patches
              });
            }
            return callbackWithCode(second);
          }
          // We need to apply reverse patches
          patches = searchForPatches(recPatches, second, lastSecond);
          if (patches.length) {
            player.applyReversePatchesAndId({
              id: patches[0].id,
              patches: patches
            });
          }
          return callbackWithCode(second);
        }
      };
    }

    var dmPlayerFactory = function(recording, callback) {

      var player = recording.player ? newRecordingPlayer : oldRecordingPlayer;

      return player(recording, callback);

    };

    return dmPlayerFactory;
  });
});