define(['angular'], function (angular) {
    'use strict';

    angular.module('dm-teamspeak', ['dm-codeshare']).directive('dmTeamspeak', ['Sockets', 'dmUser', '$window', 'codeShareService',
        function (Sockets, dmUser, $window, codeShareService) {
            return {
                restrict: 'E',
                templateUrl: '/static/dm-modules/dm-teamspeak/dm-teamspeak.html',
                link: function (scope) {

                    scope.setCurrentWriter = codeShareService.setCurrentWriter;
                    scope.isUserAWriter = codeShareService.isUserAWriter;

                    scope.channelList = [{cid: 0, name: 'Loading...'}];

                    dmUser.getCurrentUser().then(function(data) {
                        scope.clientId = data.result.teamspeak.clientId;
                        scope.userId = data.result._id;
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
                                $window.location.href = '/?ref=channel_' + channel.name + '#/space/5478f03cd86871a82bb44c31/workspace/5478f678e50f80e012ebfd91';
                            }
                        });
                    };

                    scope.moveAllClientsToChannel = function (channel) {
                        Sockets.emit('teamspeak.moveAllClientsToChannel', channel.cid);
                    };

                    Sockets.on('teamspeak.channelList', function (channelList) {

                        if (!scope.userChannel){
                            scope.userChannel = getMyChannel(channelList);
                        }

                        scope.channelList = channelList;
                        ifNoCurrentWriterInWorkspaceSetFirstLinkedClient();

                        scope.$apply();
                    });

                    function ifNoCurrentWriterInWorkspaceSetFirstLinkedClient(){
                        if (!codeShareService.isSetCurrentWriter()) {

                            console.log(scope.userChannel, scope.clientId);
                            _.each(scope.channelList, function (channel) {
                                if (channel.cid === scope.userChannel) {
                                    _.each(channel.clients, function (client) {
                                        if (client.isLinked) {
                                            codeShareService.setCurrentWriter(client.userId);
                                            return;
                                        }
                                    });
                                }
                            });
                        }
                    }


                    function getMyChannel(channelList){
                        var userChannel=null;
                        _.each(channelList, function (channel) {
                                _.each(channel.clients, function (client) {
                                    if (client.userId === scope.userId) {
                                        userChannel = channel;
                                    }
                                });
                        });

                        return userChannel;
                    }

                    Sockets.emit('teamspeak.init');
                }
            }
        }
    ]);

});
