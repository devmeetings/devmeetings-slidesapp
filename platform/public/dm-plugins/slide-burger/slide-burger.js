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
        'top': ['top', 'góra', 'gora', 'górna bułka', 'gorna bulka'],
        'ananas': ['ananas','pineapple'],
        'awokado': ['awokado','avocado','advocato'],
        'bazylia': ['bazylia','brazylia','basil'],
        'bekon': ['bekon','becon'],
        'biale_oliwki': ['biale oliwki','olives', 'oliwki', 'olivki'],
        'cebula_2': ['cebula_2','młoda cebula', 'cebulka'],
        'chicoree': ['chicoree','pekińska', 'pekinska', 'salata pekinska', 'sałata pekińska'],
        'czarne_oliwki': ['czarne oliwki', 'czarne olivki'],
        'frytki': ['frytki','french fries','fries','pommes-frittes', 'fryty'],
        'keczup': ['keczup','ketchup'],
        'kielki': ['kielki','vege'],
        'kotlet_marchewkowy': ['kotlet marchewkowy','carrot burger','carrotburget','marchewka','karota','karoty','carrots'],
        'kurczak': ['kurczak','chicken', 'chickenburger', 'kurczakburger'],
        'mozarella': ['mozarella', 'mocarella', 'mocarelka', 'mozarela', 'mozarelka'],
        'musztarda': ['musztarda','mustard'],
        'ogorek': ['ogorek','cucumber','qqmber'],
        'papryka': ['papryka','paprica','chilli'],
        'pieczarki': ['pieczarki','mushrooms','grzybki','haluny','champignion'],
        'pietruszka': ['pietruszka','trawa'],
        'pomidor': ['pomidor_2','pomidorek', 'pomidor malinowy'],
        'rukola': ['rukola','rucoli'],
        'rybka': ['rybka','fishi', 'fishburger', 'ryba'],
        'rzodkiewka': ['rzodkiewka'],
        'salata_2': ['salata_2'],
        'seitan': ['seitan','wtf2'],
        'ser': ['almette'],
        'smietana': ['smietana'],
        'sos_': ['sos_','sosik'],
        'sos_2': ['sos_2','sos szefa'],
        'sos_3': ['sos_3','jogurt','yoghurt'],
        'sos_4': ['sos_4','soja','soy sauce'],
        'sos_5': ['sos_5','ziemniok','łotysz'],
        'sos_6': ['sos_6', 'sos czosnkowy', 'czosnek', 'czosnkowy'],
        'sos_7': ['sos_7', 'sos majonezowy', 'majonez', 'majonezowy'],
        'sos_8': ['sos_8', 'sos tatarski', 'tatar'],
        'sos_9': ['sos_9', 'sos serowy', 'chedar', 'serowy'],
        'sos_pomidorowy': ['sos_pomidorowy','tomato sauce','sos pomidorowy','uncle ben\'s'],
        'szpinak': ['szpinak','spinachi'],
        'tempeh': ['tempeh','ihavenoideawhatiamdoing']
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
        '$timeout',
        function($timeout) {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-burger.html',
                link: function(scope, element) {
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
