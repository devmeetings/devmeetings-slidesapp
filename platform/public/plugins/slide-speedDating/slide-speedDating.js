define(['module', '_', 'slider/slider.plugins', 'howler', 'peerjs', 'services/User'], function(module, _, sliderPlugins, howler, User) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('slide', 'speedDating', 'slide-speed-dating', 3000).directive('slideSpeedDating', [
        '$timeout', 'Sockets', 'DeckAndSlides',
        function($timeout, Sockets, DeckAndSlides) {

            var sounds = new howler.Howl({
                urls: [path + '/sounds/sprite.mp3', path + '/sounds/sprite.wav'],
                sprite: {
                    newPerson: [0, 6000],
                    voiceSwap: [6100, 8400]
                }
            });
            return {
                restrict: 'E',
                scope: {
                    speedDating: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-speedDating.html',
                link: function(scope, element) {
                    _.defaults(scope.speedDating, {
                        time: 5,
                        perPerson: 10
                    });
                    var toInt = function(x) {
                        var i = parseInt(x, 10);
                        return isNaN(i) ? 0 : i;
                    };
                    var updateInteractions = function() {
                        scope.interactions = Math.floor(toInt(scope.speedDating.time) * 60 / (toInt(scope.speedDating.perPerson) + 5)) / 2;
                        scope.session.left = scope.interactions;
                    };
                    scope.$watch('speedDating', updateInteractions, true);
                    scope.session = {
                        running: false,
                        timeLeft: 5,
                        type: 0,
                        left: scope.interactions,
                        round: 0
                    };

                    scope.testPlay = function(what) {
                        sounds.play(what);
                    };
                    scope.startDating = function() {
                        Sockets.emit('speedDating.startDating');
                    };
                    var updateTimeLeft = function() {
                        scope.session.timeLeft = (scope.session.endDate.getTime() - new Date().getTime()) / 1000;
                        return scope.session.timeLeft <= 0;
                    };

                    var updateSession = function() {
                        scope.session.type = (scope.session.type + 1) % 2;
                        if (scope.session.type === 0) {
                            scope.session.left--;
                            scope.session.round++;
                        }
                    };
                    var playSound = function() {
                        var toPlay = ['newPerson', 'voiceSwap'];
                        sounds.play(toPlay[scope.session.type / 2]);
                    };


                    var timer = function(self, time, other, starting) {
                        if (starting) {
                            scope.session.endDate = new Date(new Date().getTime() + time * 1000);
                        }

                        var isFinished = updateTimeLeft();
                        if (isFinished) {

                            updateSession();
                            playSound();
                            // ending
                            if (scope.session.left) {
                                other();
                            } else {
                                scope.session.running = false;
                                Sockets.emit('speedDating.finish');
                            }
                        } else {
                            $timeout(self(), 200);
                        }
                    };

                    var change = timer.bind(null, function() {
                        return change;
                    }, toInt(scope.speedDating.time), function() {
                        Sockets.emit('speedDating.nextRound', {
                            round: scope.session.round
                        });
                        // get round start check qt table and start calling.
                        talking(true);
                    });
                    var talking = timer.bind(null, function() {
                        return talking;
                    }, toInt(scope.speedDating.perPerson), function() {
                        // destroy calling
                        change(true);
                    });
                    Sockets.on('speedDating.startDating', function() {
                        change(true);
                        sounds.play('newPerson');
                    });

                    var queueTable = [];
                    Sockets.on('speedDating.roundRobin', function(qT) {
                        queueTable = qT;
                        scope.interactions = queueTable.length;
                        scope.session.left = scope.interactions;
                        scope.$digest();
                    });

                    Sockets.emit('speedDating.countQueues', {
                        deck: eckAndSlides.deckId,
                        slide: scope.slide.id
                    }, function() {});
                }
            };
        }
    ]).controller('VideoDatingController', ['$scope', '$timeout', 'Sockets', 'User', 'DeckAndSlides',
        function($scope, $timeout, Sockets, User, DeckAndSlides) {
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            var peer;
            $scope.sd = {
                connections: []
            };
            Sockets.on('speedDating.connections', function(connections) {
                $scope.sd.connections = connections;
                $scope.$digest();
            });
            var MyMediaStream;
            var setMyVideo = function() {
                navigator.getUserMedia({
                    video: true
                }, function(MediaStream) {
                    MyMediaStream = MediaStream;

                    Sockets.emit('speedDating.connected', {
                        deck: DeckAndSlides.deckId,
                        slide: $scope.slide.id
                    });

                    document.querySelector('video.me').src = URL.createObjectURL(MediaStream);

                }, function(error) {
                    console.log('error', error);
                });
            };
            var callConnection;
            var connectToPeer = function(userData) {
                var username = userData.name.replace(/[^\w|-]|\s/g, '_');
                peer = new Peer(username, {
                    key: 'k7vpr9xlmbc323xr',
                    config: {
                        'iceServers': [{
                            url: 'stun:stun.l.google.com:19302'
                        }, {
                            url: 'stun:stun1.l.google.com:19302'
                        }, {
                            url: 'stun:stun2.l.google.com:19302'
                        }, {
                            url: 'stun:stun3.l.google.com:19302'
                        }, {
                            url: 'stun:stun4.l.google.com:19302'
                        }]
                    }
                });
                peer.on('open', function() {
                    setMyVideo();
                });
                peer.on('close', function() {
                    // destroy connection
                });
                peer.on('call', function(call) {
                    // Answer the call, providing our mediaStream
                    callConnection = call;
                    callConnection.on('stream', function(stream) {
                        document.querySelector('video.other').src = URL.createObjectURL(stream);
                    });
                    callConnection.answer(MyMediaStream);
                });
            };

            Sockets.on('speedDating.startRound', function(data) {
                if (callConnection && callConnection.close)
                    callConnection.close();
                if (data.type === 'call') {
                    callConnection = peer.call(data.user.username.replace(/[^\w|-]|\s/g, '_'), MyMediaStream);
                    callConnection.on('stream', function(stream) {
                        document.querySelector('video.other').src = URL.createObjectURL(stream);
                    });
                }
            });
            Sockets.on('speedDating.finish', function() {
                if (callConnection && callConnection.close)
                    callConnection.close();
            });
            User.setCallback(connectToPeer);
            User.getUserData();
        }
    ]);

});