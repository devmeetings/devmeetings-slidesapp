require(['config'], function() {
    require(["decks/"+slides, "_", "ace", "slider/slider", "slider/slider.plugins", "directives/layout-loader", "plugins/presentation-layout-std/presentation-layout-std"], function(deck, _, ace, slider, sliderPlugins) {

        slider.controller('SliderCtrl', ['$scope',
            function($scope) {
                $scope.deck = deck;
                $scope.editMode = true;
                $scope.$on('deck', function(ev, newDeck) {
                    $scope.deck = newDeck;
                });
            }
        ]);

        slider.controller('SliderEditCtrl', ['$scope', "$window",
            function($scope, $window) {
                $scope.deck = deck;
            }
        ]).directive('yamlEditor', ['$rootScope', "$window", "$http",
            function($rootScope, $window, $http) {
                return {
                    restrict: 'E',
                    scope: {
                        deck: '='
                    },
                    template: '<div class="editor editor-live"></div>',
                    link: function(scope, element) {
                        var editor = ace.edit(element.find('.editor')[0]);
                        editor.setTheme('ace/theme/todr');
                        editor.getSession().setMode('ace/mode/json');
                        editor.setValue(JSON.stringify(scope.deck, null, 2));
                        var x =  function() {
                            var value = editor.getValue();
                            scope.$apply(function() {
                                scope.deck = JSON.parse(value);
                                $http.put('/api/decks/' + slides, scope.deck);
                                $rootScope.$broadcast('deck', scope.deck);
                                $window.postMessage({
                                    type: 'deck',
                                    data: scope.deck
                                }, $window.location);
                            });
                        };
                        editor.on('change', _.throttle(x, 100));
                    }
                };
            }
        ]);

        angular.bootstrap(document, ["slider"]);
        // TODO shitty
        setTimeout(function() {
            sliderPlugins.trigger('load');
        }, 200);
    });
});
