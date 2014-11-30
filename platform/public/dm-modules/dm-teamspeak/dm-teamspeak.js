define(['angular'], function (angular) {
    'use strict';

    angular.module('dm-teamspeak', []).directive('dmTeamspeak', ['Sockets', 'dmUser', '$window',
        function (Sockets, dmUser, $window) {
            return {
                restrict: 'E',
                templateUrl: '/static/dm-modules/dm-teamspeak/dm-teamspeak.html',
                link: function (scope) {

                    scope.channelList = [{cid: 0, name: 'Loading...'}];

                    dmUser.getCurrentUser().then(function(data) {
                        scope.clientId = data.result.teamspeak.clientId;
                        scope.isTrainer = !!_.find(data.result.acl, function(acl){ return acl == 'trainer'; });
                    }, function (err) {

                    });

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
                                $window.location.href = '/?ref=channel_' + channel.name + '#/space/541bc93b9b16b5b16c553927/workspace/5478d497d39309861bd53752';
                            }
                        });
                    };

                    scope.moveAllClientsToChannel = function (channel) {
                        Sockets.emit('teamspeak.moveAllClientsToChannel', channel.cid);
                    };

                    Sockets.on('teamspeak.channelList', function (channelList) {
                        scope.channelList = channelList;
                        scope.$apply();
                    });

                    Sockets.emit('teamspeak.init');
                }
            }
        }
    ]);

});
