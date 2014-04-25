define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('slide', 'chat', 'slide-chat', 1).directive('slideChat', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/part.html',
                controller: 'ChatController'
            };
        }
    ]).controller('ChatController', ['$scope', function($scope){
        $scope.messages = [];
        $scope.sendMessage = function () {
            $scope.messages.push($scope.messageText);
            $scope.messageText = '';
        };
    }]);

});
