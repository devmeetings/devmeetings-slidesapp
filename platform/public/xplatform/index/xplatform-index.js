define(['module', 'angular', '_', 'angular-deckgrid', 'xplatform/xplatform-app', 'slider/slider', 'utils/ExtractPath'], function (module, angular, _, angularDeckgrid, xplatformApp, slider, ExtractPath) {

    var path = ExtractPath(module);
   

    angular.module('xplatform').controller('XplatformDeckgridCtrl', function($scope, $transclude) {
        this.renderElement = $transclude;
    }).directive('xplatformDeckgrid', [ function () {
        return {
            restrict: 'E',
            scope: {
                title: '=',
                elements: '=',
                onSelect: '&'
            },
            replace: true,
            transclude: true,
            templateUrl: path + '/xplatform-deckgrid.html',
            controller: 'XplatformDeckgridCtrl'
        }
    }]).directive('xplatformDeckgridElement', [ function () {
        return {
            restrict: 'E',
            require: '^xplatformDeckgrid',
            link: function(scope, element, attrs, controller) {
                controller.renderElement(scope, function (dom) {
                    element.append(dom);
                });
            }
        }
    }]);
    
    
    angular.module('xplatform').controller('XplatformIndexCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {


        $scope.index = {
            decks: [],
            decksToDisplay: [],
            star: function (event, deck) {
                event.preventDefault();
            }
        };

        var filterTabs = function (filterValue) {
            $scope.index.decksToDisplay = $filter('filter')($scope.index.decks, {title: filterValue});
            $scope.index.eventsToDisplay = $filter('filter')($scope.index.events, {title: filterValue});
        };

        $http.get('/api/decks').success( function (decks) {
            $scope.index.decks = decks;    
            filterTabs($scope.navbar.searchText);
        });

        $http.get('/api/events').success( function (events) {
            $scope.index.events = events;
            filterTabs($scope.navbar.searchText);
        });

        $scope.$watch('navbar.searchText', function (newVal, oldVal) {
            filterTabs(newVal);
        });
    }]); 
});



