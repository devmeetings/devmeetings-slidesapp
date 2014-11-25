define(['angular'], function (angular) {
    'use strict';

    angular.module('dm-teamspeak', []).directive('dmTeamspeak', ['Sockets',
        function (Sockets) {
            return {
                restrict: 'E',
                templateUrl: '/static/dm-modules/dm-teamspeak/dm-teamspeak.html',
                link: function (scope, element, attrs) {

                    scope.channelList = [{cid: 0, name: 'Loading...'}];

                    scope.linkClient = function (client) {
                        Sockets.emit('teamspeak.linkClient', client, function (error) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Powiązano z klientem Teamspeak');
                            }
                        });
                        console.log(client);
                    };

                    scope.moveToChannel = function (channel) {
                        Sockets.emit('teamspeak.moveToChannel', channel, function (error) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Przeniesiono');
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
