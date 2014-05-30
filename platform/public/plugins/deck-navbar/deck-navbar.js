define(['module', '_', 'slider/slider.plugins', 'services/CurrentSlideManager'], function(module, _, sliderPlugins, CurrentSlideManager) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('deck.slides', '*', 'deck-navbar', 1).directive('deckNavbar', [
        '$rootScope', '$location', '$http', 'CurrentSlideManager',
        function($rootScope, $location, $http, CurrentSlideManager) {

            return {
                restrict: 'E',
                scope: {
                    slides: '=context'
                },
                templateUrl: path + '/deck-navbar.html',

                link: function($scope) {
                    $scope.csm = CurrentSlideManager;
                    $scope.addSlide = function() {
                        // Update deck
                        $scope.deck.slides.push({
                            id: 'empty' + new Date(),
                            name: 'New slide'
                        });
                        // TODO [ToDr] TEMP hack
                        $http.put('/api/decks/' + slides, $scope.deck);
                    };
                }
            };
        }
    ]);

});
