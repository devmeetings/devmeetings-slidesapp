require(['config'], function() {
    require(["data", "ace", "slider/slider", "slider/slider.plugins", "directives/layout-loader", "plugins/presentation-layout-std/presentation-layout-std"], function(deck, ace, slider, sliderPlugins) {

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
        ]).directive('yamlEditor', ['$rootScope', "$window",
            function($rootScope, $window) {
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

                        editor.on('change', function() {
                            var value = editor.getValue();
                            scope.$apply(function() {
                                scope.deck = JSON.parse(value);
                                $rootScope.$broadcast('deck', scope.deck);
                                $window.postMessage({
                                    type: 'deck',
                                    data: scope.deck
                                }, $window.location);
                            });
                        });
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