define(['module', '_', 'slider/slider.plugins', 'howler', 'peerjs', 'services/User'], function (module, _, sliderPlugins, howler, User) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('slide', 'speedDating', 'slide-speed-dating', 3000).directive('slideSpeedDating', [
        '$timeout',
        function ($timeout) {

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
                link: function (scope, element) {
                    _.defaults(scope.speedDating, {
                        time: 15,
                        perPerson: 40
                    });
                    var toInt = function (x) {
                        var i = parseInt(x, 10);
                        return isNaN(i) ? 0 : i;
                    };
                    var updateInteractions = function () {
                        scope.interactions = Math.floor(toInt(scope.speedDating.time) * 60 / (toInt(scope.speedDating.perPerson) + 5)) / 2;
                        scope.session.left = scope.interactions;
                    };
                    scope.$watch('speedDating', updateInteractions, true);


                    scope.session = {
                        running: false,
                        timeLeft: 5
                    };

                    scope.testPlay = function (what) {
                        sounds.play(what);
                    };
                    scope.startDating = function () {
                        var session = {
                            running: true,
                            type: 0,
                            left: scope.interactions,
                            endDate: new Date()
                        };

                        var updateTimeLeft = function () {
                            session.timeLeft = (session.endDate.getTime() - new Date().getTime()) / 1000;
                            return session.timeLeft <= 0;
                        };

                        var updateSession = function () {
                            session.type = (session.type + 1) % 4;
                            if (session.type === 0) {
                                session.left--;
                            }
                        };
                        var playSound = function () {
                            var toPlay = ['newPerson', 'voiceSwap'];
                            sounds.play(toPlay[session.type / 2]);
                        };


                        var timer = function (self, time, other, starting) {
                            if (starting) {
                                session.endDate = new Date(new Date().getTime() + time * 1000);
                            }

                            var isFinished = updateTimeLeft();
                            if (isFinished) {

                                updateSession();
                                playSound();
                                // ending
                                if (session.left) {
                                    other();
                                } else {
                                    session.running = false;
                                }
                            } else {
                                $timeout(self(), 200);
                            }
                        };

                        var change = timer.bind(null, function () {
                            return change;
                        }, 5, function () {
                            talking(true);
                        });
                        var talking = timer.bind(null, function () {
                            return talking;
                        }, toInt(scope.speedDating.perPerson), function () {
                            change(true);
                        });

                        scope.session = session;
                        sounds.play('newPerson');
                        change(true);
                    };
                }
            };
        }
    ]).controller('VideoDatingController', ['$scope', '$timeout', 'Sockets', 'User', 'DeckAndSlides',
        function ($scope, $timeout, Sockets, User, DeckAndSlides) {
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            var peer;
            $scope.sd = {
                connections: []
            };
            Sockets.on('speedDating.connections', function (connections) {
                console.log('here', connections);
                $scope.sd.connections = connections;
                $scope.$digest();
            });
            var setMyVideo = function () {
                navigator.getUserMedia({video: true}, function (MediaStream) {
                    DeckAndSlides.deck.then(function (data) {
                        console.log(data);
                        Sockets.emit('speedDating.connected', {deck: data._id, slide: $scope.slide.id});
                    });
                    document.querySelector('video.me').src = URL.createObjectURL(MediaStream);

                }, function (error) {
                    console.log('error', error);
                });
            };
            var connectToPeer = function (userData) {
                var username = userData.name.replace(/[^\w|-]|\s/g, '_');
                peer = new Peer(username, {key: 'k7vpr9xlmbc323xr', config: {'iceServers': [
                    {url: 'stun:stun.l.google.com:19302'},
                    {url: 'stun:stun1.l.google.com:19302'},
                    {url: 'stun:stun2.l.google.com:19302'},
                    {url: 'stun:stun3.l.google.com:19302'},
                    {url: 'stun:stun4.l.google.com:19302'}
                ]}});
                peer.on('open', function () {
                    setMyVideo();
                });
                peer.on('close', function () {
                    // destroy connection
                });
            };
            User.setCallback(connectToPeer);
            User.getUserData();
        }]);

});