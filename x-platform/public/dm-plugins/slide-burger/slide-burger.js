define(['module', '_', 'slider/slider.plugins', 'ace', './slide-burger.mapping', './slide-burger.microtasks'], function(module, _, sliderPlugins, ace, mapping) {
  'use strict';

  var path = sliderPlugins.extractPath(module);

  function findImg(text) {
    var ret = 'empty';
    _.each(mapping, function(value, key) {
      if (value.indexOf(text) !== -1) {
        ret = key;
      }
    });
    return ret;
  }

  function imgPath(img) {
    return path + "/gfx/" + img + ".png";
  }

  function splitText(text) {
    var x = text.split(' x ');
    if (x.length === 1) {
      return [1, x[0]];
    }
    return [parseInt(x[0], 10), x[1]];
  }

  sliderPlugins.registerPlugin('slide', 'burger', 'slide-burger', 6000).directive('slideBurger', [
    '$timeout',
    function($timeout) {
      return {
        restrict: 'E',
        scope: {
          data: '=data',
          slide: '=context'
        },
        templateUrl: path + '/slide-burger.html',
        link: function(scope) {

          function displayBurgers(output) {
            
            function createNewGroupIfNeeded(groups, item, key) {
              if (findImg(item) === 'top') {
                var nextItem = output[key + 1];
                if (nextItem && findImg(nextItem) === 'spod') {
                  groups.push([]);
                }
              }
            }

            if (!_.isArray(output)) {
              scope.burgers = [];
              return;
            }

            var burgers = output.reduce(function(groups, item, key) {
              groups[groups.length - 1].push(item);

              createNewGroupIfNeeded(groups, item, key);

              return groups;
            }, [
              []
            ]);

            scope.burgers = burgers.map(displayOutput);
          }

          function displayOutput(output) {
            // images to display in reversed order
            var burger = [];

            // map output
            output.filter(_.identity).map(splitText).map(function(d) {
              var img = findImg(d[1]);

              for (var i = 0; i < d[0]; ++i) {
                burger.unshift({
                  visible: false,
                  src: imgPath(img)
                });
              }
            });

            function animate(idx) {
              var l = burger.length - 1;
              if (idx > l) {
                return;
              }
              burger[l - idx].visible = true;
              $timeout(function() {
                animate(idx + 1);
              }, 250);
            }
            $timeout(function() {
              animate(0);
            }, 10);

            return burger;
          }

          sliderPlugins.listen(scope, 'slide.jsonOutput.display', displayBurgers);
        }
      };
    }
  ]);

});
