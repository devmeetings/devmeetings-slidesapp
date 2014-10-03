define(['module', '_', 'slider/slider.plugins', 'ace'], function(module, _, sliderPlugins, ace) {
    'use strict';

    var path = sliderPlugins.extractPath(module);

    var mapping = {
        'cebula': ['onion', 'cebula', 'cebule'],
        'kotlet': ['kotlet', 'mieso', 'mieso', 'mięcho', 'meat', 'beef'],
        'pomodoro': ['pomidor', 'tomato', 'tomat', 'pomodoro', 'pomidory', 'pomidora'],
        'salata': ['letuce', 'salata', 'sałata', 'sałatę', 'salate'],
        'sero': ['ser', 'cheese', 'serek', 'sero'],
        'spod': ['bulka', 'bułka', 'spód', 'dolna bułka', 'dolna bulka', 'spod', 'dol', 'dół'],
        'top': ['top', 'góra', 'gora', 'górna bułka', 'gorna bulka']
    };

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

        function() {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-burger.html',
                link: function(scope, element) {

                    function displayOutput(output) {
                            // images to display in reversed order
                        scope.display = [];

                        // map output
                        output.filter(_.identity).map(splitText).map(function(d){
                            var img = findImg(d[1]);

                            for (var i=0; i<d[0]; ++i) {
                                scope.display.unshift(imgPath(img));
                            }
                        });
                    }
                    
                    sliderPlugins.listen(scope, 'slide.jsonOutput.display', displayOutput);
                    displayOutput([
                        "spod",
                        "pomidor"
                    ]);
                }
            };
        }
    ]);

});