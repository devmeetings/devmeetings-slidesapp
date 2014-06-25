require(['config'], function () {
    require(['angular', '_', 'angular-deckgrid', 'slider/slider'], function (angular, _, angularDeckgrid, slider) {
        angular.module('xplatform').controller('XplatformIndexCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
            $scope.index = {
                decks: [],
                decksToDisplay: [],
                star: function (event, deck) {
                    event.preventDefault();
                }
            };

            $http.get('/api/decks').then( function (decks) {
                $scope.index.decks = decks.data;    

                $scope.$watch('navbar.searchText', function (newVal, oldVal) {
                    $scope.index.decksToDisplay = $filter('filter')($scope.index.decks, {title: newVal});
                });
            });
        }]); 
    });
});



