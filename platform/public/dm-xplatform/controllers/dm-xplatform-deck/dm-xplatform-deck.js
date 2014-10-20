define(['angular', 
        '_',
        'xplatform/xplatform-app',
        'directives/plugins-loader'
        ], function (angular, _, xplatformApp, pluginsLoader) {
    xplatformApp.controller('dmXplatformDeck', ['$scope', '$stateParams', '$sce', function ($scope, 
        $stateParams, $sce) {

        $scope.deck = $stateParams.deck;
        $scope.url = $sce.trustAsResourceUrl('/decks/' + $scope.deck);
    }]);
});


