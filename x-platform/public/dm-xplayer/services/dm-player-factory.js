/* globals define */
define(['_', 'dm-xplayer/dm-xplayer-app'], function (_, xplayerApp) {
  'use strict';

  xplayerApp.factory('dmPlayerFactory', function () {
    function searchForPatches (patches, startS, endS) {
      var startIdx = _.sortedIndex(patches, {
        timestamp: startS * 1000
      }, 'timestamp');

      var endIdx = _.sortedIndex(patches, {
        timestamp: endS * 1000
      }, 'timestamp');

      return patches.slice(startIdx, endIdx);
    }

    function newRecordingPlayer (recording, callback) {
      var player = recording.player;
      var recPatches = recording.patches;

      var lastSecond = -1;

      function callbackWithCode (second) {
        lastSecond = second;
        callback(player.getCurrentState());
        // When we are paused and trying to fast forward
        if (!player.isPlaying) {
          player.updatePreviousContent();
        }
      }

      return {
        setIsFromRecording: function (isFromRecording) {
          player.setIsChangeFromRecording(isFromRecording);
        },
        goToSecond: function (second) {
          // Before we apply patches we need to get rid of user content
          if (!player.isPlaying) {
            player.restorePreviousContent();
          }

          if (lastSecond === second) {
            return;
          }

          return player.runInPlayerSourceContext(function () {
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
            if (patches.length > 1) {
              player.applyReversePatchesAndId({
                id: patches[0].id,
                // We need to remove first slide (cause this will be the current state!)
                patches: patches.slice(1)
              });
            }
            return callbackWithCode(second);
          });
        },

        setIsPlaying: function (isPlaying) {
          player.setPlayerPaused(!isPlaying);
          player.isPlaying = isPlaying;
        }
      };
    }

    var dmPlayerFactory = function (recording, callback) {
      return newRecordingPlayer(recording, callback);
    };

    return dmPlayerFactory;
  });
});
