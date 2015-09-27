/* globals define */
define(['module', '_', 'slider/slider.plugins', 'ace'], function (module, _, sliderPlugins, ace) {
  'use strict';

  ace = ace.default;

  var OUTPUT_THEME = 'twilight';

  sliderPlugins.registerPlugin('slide', 'monitor', 'slide-jsonoutput', {
    name: 'JSON Output',
    description: 'Displays output from other plugins (serverRunner, jsRunner) as JSON',
    example: {
      meta: 'isPresent',
      data: true
    },
    order: 6000
  }).directive('slideJsonoutput', [

    function () {
      return {
        restrict: 'E',
        scope: {
          options: '=data',
        },
        template: '<div><div class="editor editor-output"></div></div>',
        link: function (scope, element) {

          function isJson () {
            if (scope.options && scope.options.noJson) {
              return false;
            }
            return true;
          }

          var outputAce = ace.edit(element[0].querySelector('.editor'));
          outputAce.$blockScrolling = Infinity;
          outputAce.setTheme('ace/theme/' + OUTPUT_THEME);
          outputAce.setFontSize(16);
          if (isJson()) {
            outputAce.getSession().setMode('ace/mode/json');
          }
          outputAce.setReadOnly(true);
          outputAce.setHighlightActiveLine(false);
          outputAce.setShowPrintMargin(false);
          outputAce.renderer.setShowGutter(false);

          function setValue (val) {
            outputAce.setValue(val);
            outputAce.clearSelection();
          }

          sliderPlugins.listen(scope, 'slide.jsonOutput.display', function (output, what) {
            var res;

            if (isJson()) {
              res = JSON.stringify(output, null, 2);
              if (what) {
                res = what + ':\n' + res;
              }
              setValue(res);
              return;
            }

            if (_.isArray(output)) {
              res = output.map(function (line) {
                if (_.isArray(line)) {
                  return JSON.stringify(line);
                }
                return line;
              });
              setValue(res.join('\n'));
              return;
            }
  
            setValue(output);
          });
        }
      };
    }
  ]);

  sliderPlugins.registerPlugin('slide', 'monitor', 'slide-jsrunner-jsonoutput', {
    name: 'JSRunner JSON Output',
    description: 'Displays output from JSRunner. You can choose specific variable to display or `console_log`',
    example: {
      meta: 'string',
      data: 'console_log'
    }
  }).directive('slideJsrunnerJsonoutput', [

    function () {
      return {
        restrict: 'E',
        scope: {
          monitor: '=data'
        },
        link: function (scope) {
          sliderPlugins.registerScopePlugin(scope, 'slide.slide-jsrunner', 'process', {
            monitor: _.isObject(scope.monitor) ? scope.monitor.output : scope.monitor,
            name: 'jsonoutput'
          });

          sliderPlugins.listen(scope, 'slide.slide-jsrunner.jsonoutput', function (elem) {
            sliderPlugins.trigger('slide.jsonOutput.display', elem, scope.monitor);
          });
        }

      };
    }
  ]);
});
