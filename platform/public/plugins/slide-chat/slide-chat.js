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
    ]).controller('ChatController', ['$scope', '$http', 'SlideInfo', '$timeout', function($scope, $http, SlideInfo, $timeout){

        var presentation = SlideInfo.presentation;
        var slide = SlideInfo.slide;
        var url = '/api/comments';


        $scope.messages = [];

        $http.get(url + '/' + presentation + '/' + slide)
            .success(function(data){
                $scope.messages = data;
                $timeout(function(){
                    $scope.scrollToBottom();
                });
            })
        ;

        $scope.scrollToBottom = function () {
            var elem = document.getElementById('chatscroll');
            elem.scrollTop = elem.scrollHeight;
        };

        $scope.sendMessage = function () {
            $http.post(url, {
                presentation: presentation,
                slide: slide,
                comment: $scope.messageText,
                timestamp: new Date().getTime()
            }).success(function(data){
                $scope.messages.push(data);
                $scope.messageText = '';
                $timeout(function(){
                    $scope.scrollToBottom();
                });
            });

        };
    }]);

});
