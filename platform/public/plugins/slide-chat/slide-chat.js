define(['module', 'slider/slider.plugins', 'services/SlideInfo'], function(module, sliderPlugins, SlideInfoService) {

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
    ]).controller('ChatController', ['$scope', '$http', 'SlideInfo', '$timeout', function($scope, $http, SlideInfo, $timeout){

        var presentation = SlideInfo.presentation;
        var slide = SlideInfo.slide;
        var url = '/api/comments';
        var rand = Math.round(Math.random() * 3000) + 500;

        $scope.code = {
            js: '',
            html: '',
            css: ''
        };


        $scope.messages = [];
        function loadComments(callback){
            $http.get(url + '/' + presentation + '/' + slide)
                .success(function(data){
                    $scope.messages = data;
                    $timeout(function(){
                        $scope.scrollToBottom();
                    });
                    if(callback){
                        callback();
                    }
                })
            ;
        }

        function loadTimeout(){
            setTimeout(function(){
                loadComments(loadTimeout);
            }, rand);
        }

        loadComments(loadTimeout);

        $scope.scrollToBottom = function () {
            var elem = document.getElementById('chatscroll');
            elem.scrollTop = elem.scrollHeight;
        };

        $scope.hasCode = function(message){
            return (typeof message.code !== 'undefined' && message.code.js !== '' && message.code.css !== '' && message.code.html !== '');
        };

        $scope.sendMessage = function () {
            $http.post(url, {
                presentation: presentation,
                slide: slide,
                comment: $scope.messageText,
                timestamp: new Date().getTime(),
                code: $scope.code
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
