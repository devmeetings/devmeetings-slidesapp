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
                    var iteration = 0;

                    function displayOutput(output) {
                        iteration++;
                        var myIteration = iteration;
                        // images to display in reversed order
                        scope.display = [];

                        // map output
                        output.filter(_.identity).map(splitText).map(function(d) {
                            var img = findImg(d[1]);

                            for (var i = 0; i < d[0]; ++i) {
                                scope.display.unshift({
                                    visible: false,
                                    src: imgPath(img)
                                });
                            }
                        });

                        function animate(idx) {
                            var l = scope.display.length - 1;
                            if (idx > l) {
                                return;
                            }
                            scope.display[l - idx].visible = true;
                            $timeout(function() {
                                if (myIteration !== iteration) {
                                    return;
                                }
                                animate(idx + 1);
                            }, 250);
                        }
                        $timeout(function() {
                            animate(0);
                        }, 10);
                        
                    }

                    sliderPlugins.listen(scope, 'slide.jsonOutput.display', displayOutput);
                }
            };
        }
    ]);

});
