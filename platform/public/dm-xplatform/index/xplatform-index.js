define(['module', 'angular', '_', 'angular-deckgrid', 'xplatform/xplatform-app', 'slider/slider', 'utils/ExtractPath'], function (module, angular, _, angularDeckgrid, xplatformApp, slider, ExtractPath) {

    var path = ExtractPath(module);
   

    angular.module('xplatform').controller('XplatformDeckgridCtrl', function($scope, $transclude) {
        this.renderElement = $transclude;
    }).directive('xplatformDeckgrid', [ function () {
        return {
            restrict: 'E',
            scope: {
                title: '=',
                elements: '='
            },
            replace: true,
            transclude: true,
            templateUrl: path + '/xplatform-deckgrid.html',
            controller: 'XplatformDeckgridCtrl'
        }
    }]).directive('xplatformDeckgridItem', [ function () {
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

        //$scope.index.eventsToDisplay = $filter('filter')($scope.index.events, {title: filterValue});

        $http.get('/api/dashboard').success( function (dashboard) {
            $scope.dashboard = dashboard; 
        });

    }]); 
});



