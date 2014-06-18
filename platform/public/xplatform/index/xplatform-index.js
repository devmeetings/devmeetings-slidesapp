require(['config'], function () {
    require(['angular', '_', 'angular-deckgrid', 'angular-gravatar', 'angular-ui-router', 'slider/slider', 'services/User'], function (angular, _, angularDeckgrid, angularGravatar, angularRouter, slider, User) {

        angular.module('xplatform').controller('XplatformIndexCtrl', ['$scope', '$http', '$filter', 'User', function ($scope, $http, $filter, User) {
            $scope.app = {
                searchText: '',
                decks: [],
                decksToDisplay: [],
                star: function (event, deck) {
                    event.preventDefault();
                },
                user: {}
            };

            $http.get('/api/decks').then( function (decks) {
                $scope.app.decks = decks.data;    

                $scope.$watch('app.searchText', function (newVal, oldVal) {
                    $scope.app.decksToDisplay = $filter('filter')($scope.app.decks, {title: newVal});
                });
            });

            User.getUserData( function (data) {
                $scope.app.user = data;
            });
        }]);
        angular.bootstrap(document, ['xplatform']);
    });
});



