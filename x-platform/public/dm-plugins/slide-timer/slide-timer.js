/* globals define */
define(['module', 'slider/slider.plugins', './slide-timer.html!text'], function (module, sliderPlugins, viewTemplate) {
  function t () {
    return new Date().getTime();
  }

  sliderPlugins.registerPlugin('slide', 'timer', 'slide-timer', {
    order: 10,
    name: 'Timer',
    description: 'Displays configurable timer to measure time (in minutes)',
    example: {
      meta: 'number',
      data: 60
    }
  }).directive('slideTimer', [
    '$timeout',
    function ($timeout) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          time: '=data',
          slide: '=context'
        },
        template: viewTemplate,
        link: function (scope) {
          scope.started = false;
          scope.endDate = t();

          scope.start = function () {
            scope.endDate = t() + parseFloat(scope.time) * 60 * 1000;
            scope.started = true;
            onTimer();
          };

          function onTimer () {
            if (!scope.started) {
              return;
            }
            if (scope.currentTime <= 0) {
              scope.started = false;
              return;
            }
            var currentTime = t();
            scope.timeLeft = (scope.endDate - currentTime) / 1000;

            $timeout(onTimer, 100);
          }
        }
      };
    }
  ]);
});
