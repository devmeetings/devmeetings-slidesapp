/* globals define */
define(['module', '_', 'slider/slider.plugins', './jsrunner-coffee', './slide-jsrunner.html!text'], function (module, _, sliderPlugins, coffeeRunner, viewTemplate) {
  'use strict';

  var EXECUTION_DELAY = 300;

  var evalJsCode = function (value) {
    var triggerFunctionName = '________trigger';
    // We have to process code through the plugins
    var toObserve = sliderPlugins.getPlugins('slide.slide-jsrunner', 'process').map(function (plugin) {
      return plugin.plugin;
    });

    // Now convert to some code that will be injected
    toObserve = toObserve.map(function (plugin) {
      var monitor = _.isArray(plugin.monitor) ? plugin.monitor : [plugin.monitor];

      var invoke = triggerFunctionName + '("' + plugin.name + '", ' + monitor.join(', ') + ')';
      return 'try { ' + invoke + ' } catch (e) { if (typeof __debug !== "undefined") { console.warn(e); } }';
    });

    // Actually execute code
    try {
      /* eslint-disable no-unused-vars */
      var trigger = function (name) {
        var args = [].slice.call(arguments, 1);
        sliderPlugins.trigger.apply(sliderPlugins, ['slide.slide-jsrunner.' + name].concat(args));
      };
      /* eslint-enable no-unused-vars */

      var code = ['(function(' + triggerFunctionName + ', console_log){',
        '"use strict"',
        value
      ].concat(toObserve).concat([
        '}(trigger, console_log))'
      ]).join(';\n');

      var console_log = [];
      var consoleControl = captureConsoleTo(console_log);
      /* eslint-disable no-eval */
      eval(code);
      /* eslint-enable no-eval */
      consoleControl.restore();

      return null;
    } catch (e) {
      return e;
    }
  };

  var captureConsoleTo = function (log) {
    var oldLog = window.console.log;

    window.console.log = function () {
      var args = [].slice.call(arguments);
      log.push(args);
      oldLog.apply(window.console, args);
    };

    return {
      restore: function () {
        window.console.log = oldLog;
      }
    };
  };

  var compilers = {
    'coffee': coffeeRunner
  };

  sliderPlugins.registerPlugin('slide', 'jsrunner', 'slide-jsrunner', {
    name: 'JSRunner',
    description: 'Evaluates JS code from `code` plugin in clients browser. It is possible to preprocess data (coffee) before executing',
    example: {
      meta: {
        type: 'string/bool',
        help: 'true - run js, "coffee" - run CoffeeScript'
      },
      data: true
    },
    order: 5000
  }).directive('slideJsrunner', [

    function () {
      return {
        restrict: 'E',
        scope: {
          jsrunner: '=data',
          slide: '=context'
        },
        template: viewTemplate,
        link: function (scope, element) {
          var setErrors = function (errors) {
            element.find('.errors').html(errors);
          };

          sliderPlugins.listen(scope, 'slide.slide-code.change', _.debounce(function (ev, codeEditor) {
            var code = codeEditor.getValue();

            if (compilers[scope.jsrunner]) {
              compilers[scope.jsrunner].get(function (compiler) {
                try {
                  code = compiler(code);
                } catch (e) {
                  setErrors('Compilation error: ' + e);
                }
              });
            }

            var errors = evalJsCode(code);
            setErrors(errors);

          }, EXECUTION_DELAY));
        }
      };
    }
  ]);

});
