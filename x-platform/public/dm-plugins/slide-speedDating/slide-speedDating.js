define(['module', '_', 'slider/slider.plugins', 'howler'], function(module, _, sliderPlugins, howler) {

  var path = sliderPlugins.extractPath(module);

  sliderPlugins.registerPlugin('slide', 'speedDating', 'slide-speed-dating', {
      order: 3000,
      name: 'Speed Dating',
      description: 'Speed Dating plugin',
      example: {
        meta: {
          time: {
            type: 'number',
            help: 'Total Number of Time (in minutes) for Speed Dating'
          },
          perPerson: {
            type: 'number',
            help: 'Time For Single Person (in second)'
          }
        },
        data: {
          time: 15,
          perPerson: 40
        }
      }
  }).directive('slideSpeedDating', function($timeout) {

  var sounds = new howler.Howl({
      urls: [path + '/sounds/sprite.mp3', path + '/sounds/sprite.wav'],
      sprite: {
        newPerson: [0, 6000],
        voiceSwap: [6100, 8400]
      }
  });


  return {
    restrict: 'E',
    scope: {
      speedDating: '=data',
      slide: '=context'
    },
    templateUrl: path + '/slide-speedDating.html',
    link: function(scope, element) {
      _.defaults(scope.speedDating, {
          time: 15,
          perPerson: 40
      });
      var toInt = function(x) {
        var i = parseInt(x, 10);
        return isNaN(i) ? 0 : i;
      };
      var updateInteractions = function() {
        scope.interactions = Math.floor(toInt(scope.speedDating.time) * 60 / (toInt(scope.speedDating.perPerson) + 5)) / 2;
        scope.session.left = scope.interactions;
      };
      scope.$watch('speedDating', updateInteractions, true);


      scope.session = {
        running: false,
        timeLeft: 5
      };

      scope.testPlay = function(what) {
        sounds.play(what);
      };

      scope.startDating = function() {
        var session = {
          running: true,
          type: 0,
          left: scope.interactions,
          endDate: new Date()
        };

        var updateTimeLeft = function() {
          session.timeLeft = (session.endDate.getTime() - new Date().getTime()) / 1000;
          return session.timeLeft <= 0;
        };

        var updateSession = function() {
          session.type = (session.type + 1) % 4;
          if (session.type === 0) {
            session.left--;
          }
        };
        var playSound = function() {
          var toPlay = ['newPerson', 'voiceSwap'];
          sounds.play(toPlay[session.type / 2]);
        };


        var timer = function(self, time, other, starting) {
          if (starting) {
            session.endDate = new Date(new Date().getTime() + time * 1000);
          }

          var isFinished = updateTimeLeft();
          if (isFinished) {

            updateSession();
            playSound();
            // ending
            if (session.left) {
              other();
            } else {
              session.running = false;
            }
          } else {
            $timeout(self(), 200);
          }
        };

        var change = timer.bind(null, function() {
          return change;
        }, 5, function() {
          talking(true);
        });
        var talking = timer.bind(null, function() {
          return talking;
        }, toInt(scope.speedDating.perPerson), function() {
          change(true);
        });

        scope.session = session;
        sounds.play('newPerson');
        change(true);
      };
    }
  };
  }
  );

});
