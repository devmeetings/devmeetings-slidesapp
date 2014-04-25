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
    ]).controller('ChatController', ['$scope', '$http', '$location', function($scope, $http, $location){

        var reg = new RegExp('slides/([^/]*)/slide-(.*)', 'ig');
        var res = reg.exec($location.$$absUrl);
        var presentation = res[1];
        var slide = res[2];

        var url = '/api/comments';
        $scope.messages = [];





        $scope.sendMessage = function () {

            $http.post(url, {
                presentation: presentation,
                slide: slide,
                comment: $scope.messageText,
                timestamp: new Date().getTime()
            }).success(function(){
                $scope.messages.push($scope.messageText);
                $scope.messageText = '';
            });

        };
    }]);

});
