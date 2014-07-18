define(['module', 'slider/slider.plugins', 'services/Sockets', 'services/DeckAndSlides'], function(module, sliderPlugins, SocketsFactory) {

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
    ]).controller('ChatController', ['$scope', '$timeout', 'Sockets', 'DeckAndSlides',

        function($scope, $timeout, Sockets, DeckAndSlides) {

            var slide = $scope.slide.id;

            $scope.code = {
                js: '',
                html: '',
                css: ''
            };

            $scope.messages = [];

            $scope.scrollToBottom = function() {
                $timeout(function() {
                    var elem = document.getElementById('chatscroll');
                    elem.scrollTop = elem.scrollHeight;
                });
            };

            $scope.sendMessage = function() {
                var data = {
                    presentation: DeckAndSlides.deckId,
                    slide: DeckAndSlides.slideId,
                    comment: $scope.messageText,
                    timestamp: new Date().getTime(),
                    code: $scope.code
                };
                Sockets.emit('chat.msg.send', data);
                $scope.messages.push(data);
                $scope.messageText = '';
                $scope.scrollToBottom();
            };

            Sockets.on('chat.msg.send', function(data) {
                $scope.$apply(function() {
                    $scope.messages.push(data);
                    $scope.scrollToBottom();
                });
            });

            Sockets.emit('chat.join', {
                presentation: DeckAndSlides.deckId,
                slide: DeckAndSlides.slideId
            }, function(data) {
                $scope.$apply(function() {
                    $scope.messages = $scope.messages.concat(data);
                    $scope.scrollToBottom();
                });
            });
        }
    ]);

});