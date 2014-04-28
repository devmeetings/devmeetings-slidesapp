define(['module', 'slider/slider.plugins', 'services/SlideInfo', 'services/Sockets'], function(module, sliderPlugins, SlideInfoService, SocketsFactory) {

    var EXECUTION_DELAY = 300;
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
                controller: 'ChatController',
                link: function(scope, element) {
                    sliderPlugins.listen(scope, 'slide.slide-code.change', _.debounce(function(ev, codeEditor) {
                        scope.code.js = codeEditor.getValue();
                    }, EXECUTION_DELAY));

                    sliderPlugins.listen(scope, 'slide.slide-fiddle.change', _.debounce(function(ev) {
                        scope.code.js = ev.js;
                        scope.code.css = ev.css;
                        scope.code.html = ev.html;
                        scope.code.activeTab = ev.active;

                    }, EXECUTION_DELAY));
                }
            };
        }
    ]).controller('ChatController', ['$scope', 'SlideInfo', '$timeout', 'Sockets', function($scope, SlideInfo, $timeout, Sockets){

        var presentation = SlideInfo.presentation;
        var slide = SlideInfo.slide;
        
        $scope.code = {
            js: '',
            html: '',
            css: ''
        };

        $scope.messages = [];   

        $scope.scrollToBottom = function () {
            $timeout(function(){
                var elem = document.getElementById('chatscroll');
                elem.scrollTop = elem.scrollHeight;
            });
        };

        $scope.sendMessage = function () {
            var data = {
                presentation: presentation,
                slide: slide,
                comment: $scope.messageText,
                timestamp: new Date().getTime(),
                code: $scope.code
            };
            Sockets.socket.emit('sendChatMsg', data);
            $scope.messages.push(data);
            $scope.messageText = '';
            $scope.scrollToBottom();
        };

        Sockets.socket.on('sendChatMsg', function (data) {
            $scope.messages.push(data);  
            $scope.$apply();
            $scope.scrollToBottom();
        });
        
        Sockets.socket.emit('joinChat', {
            presentation: presentation,
            slide: slide
        }, function (data) {
            $scope.messages = $scope.messages.concat(data);
            $scope.$apply();
            $scope.scrollToBottom();
        });
    }]);

});
