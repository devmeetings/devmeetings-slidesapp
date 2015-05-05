define(['module', '_', 'slider/slider.plugins'], function(module, _, sliderPlugins) {
  'use strict';

  var EXECUTION_DELAY = 1000;

  var path = sliderPlugins.extractPath(module);

  sliderPlugins.registerPlugin('slide', 'serverRunner', 'slide-server-runner', 4000).directive('slideServerRunner', [
    'Sockets', 'dmPlayer',
    function(Sockets, dmPlayer) {

      var updateScope = function() {};
      Sockets.on('serverRunner.code.result', function(data) {
        updateScope(data);
      });


      return {
        restrict: 'E',
        scope: {
          runner: '=data',
          slide: '=context'
        },
        templateUrl: path + '/slide-serverRunner.html',
        link: function(scope) {
          updateScope = function(data) {
            scope.$apply(function() {
              scope.success = data.success;
              scope.errors = data.errors || '';
              scope.stacktrace = data.stacktrace;
            });

            sliderPlugins.trigger('slide.serverRunner.result', data);
            sliderPlugins.trigger('slide.jsonOutput.display', data.result);
          };

          var lastStateId;
          function emitRun(prop, path) {
            if (!lastStateId) {
              return;
            }

            var data = {
              runner: scope.runner,
              path: path,
              timestamp: new Date().getTime(),
            };
            data[prop] = lastStateId;
            Sockets.emit('serverRunner.code.run', data);
          }

          var emitRunDebounced = _.debounce(emitRun, EXECUTION_DELAY);
          // TODO [ToDr] That's terrible!
          var lastType = {};
          dmPlayer.onCurrentStateId(scope, function(stateId) {
            lastStateId = stateId;
          });

          sliderPlugins.listen(scope, 'slide.slide-code.change', function(ev, editor, path) {
            sliderPlugins.trigger('slide.serverRunner.code.run');
            sliderPlugins.trigger('slide.jsonOutput.display', 'Working...');

            lastType.type = 'code';
            lastType.path = path;
            emitRunDebounced(lastType.type, lastType.path);
          });

          sliderPlugins.listen(scope, 'slide.slide-workspace.run', function(workspace, path) {
            sliderPlugins.trigger('slide.serverRunner.code.run');
            sliderPlugins.trigger('slide.jsonOutput.display', 'Working...');

            lastType.type = 'files';
            lastType.path = path;
            emitRunDebounced(lastType.type, lastType.path);
          });
        }
      };
    }
  ]);

});
