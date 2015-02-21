define(['angular',
    '_',
    'xplatform/xplatform-app',
    'directives/plugins-loader'
], function(angular, _, xplatformApp, pluginsLoader) {
    xplatformApp.controller('dmXplatformDeck', ['$scope', '$stateParams', '$sce', 'dmBrowserTab',
        function($scope, $stateParams, $sce, dmBrowserTab) {
            

            $scope.deck = $stateParams.deck;
            dmBrowserTab.setTitleAndIcon('Slides'); 

            var params = [];
            if ($stateParams.from) {
                params.push("from=" + $stateParams.from);
            }
            if ($stateParams.to) {
                params.push("to=" + $stateParams.to);
            }
            $scope.url = $sce.trustAsResourceUrl('/decks/' + $scope.deck + "?" + params.join("&"));
        }
    ]);
});
