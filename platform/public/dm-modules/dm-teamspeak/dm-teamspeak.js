define(['angular'], function (angular) {
    'use strict';

    angular.module('dm-teamspeak', []).directive('dmTeamspeak', ['Sockets',
        function (Sockets) {
            return {
                restrict: 'E',
                templateUrl: '/static/dm-modules/dm-teamspeak/dm-teamspeak.html',
                link: function (scope) {

                    scope.channelList = [{cid: 0, name: 'Loading...'}];

                    scope.linkClient = function (client) {
                        Sockets.emit('teamspeak.linkClient', client, function (error) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Powiązano z klientem Teamspeak');
                            }
                        });
                    };

                    scope.unlinkClient = function () {
                        Sockets.emit('teamspeak.unlinkClient', function (error) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Rozłączono z klientem Teamspeak');
                            }
                        });
                    };

                    scope.moveToChannel = function (channel) {
                        Sockets.emit('teamspeak.moveToChannel', channel.cid, function (error) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('You have been moved');
                            }
                        });
                    };

                    Sockets.on('teamspeak.channelList', function (channelList) {
                        scope.channelList = channelList;
                        scope.$apply();
                        console.log(channelList);
                    });

                    Sockets.emit('teamspeak.init');
                }
            }
        }
    ]);

});
