define(['slider'], function(slider) {

    slider.directive('layoutLoader', ['$compile',
        function($compile) {
            return {
                restrict: 'E',
                scope: {
                    data: '=',
                    layout: '@'
                },
                template: '',
                link: function($scope, $element) {
                    var el = $compile('<' + $scope.layout + ' data="data"></' + $scope.layout + '>')($scope);
                    $element.append(el);
                }
            }
        }
    ]);
});