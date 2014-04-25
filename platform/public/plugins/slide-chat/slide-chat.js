define(['module', 'slider/slider.plugins', 'services/SlideInfo'], function(module, sliderPlugins, SlideInfoService) {

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
    ]).controller('ChatController', ['$scope', '$http', 'SlideInfo', function($scope, $http, SlideInfo){

        var presentation = SlideInfo.presentation;
        var slide = SlideInfo.slide;
        var url = '/api/comments';


        $scope.messages = [];

        $http.get(url + '/' + presentation + '/' + slide)
            .success(function(data){
                $scope.messages = data;
            })
        ;

        $scope.sendMessage = function () {
            $http.post(url, {
                presentation: presentation,
                slide: slide,
                comment: $scope.messageText,
                timestamp: new Date().getTime()
            }).success(function(data){
                $scope.messages.push(data);
                $scope.messageText = '';
            });

        };
    }]);

});
