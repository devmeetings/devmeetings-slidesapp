define(['angular', 'slider/slider.plugins'], function (angular, sliderPlugins) {
    'use strict';

    angular.module('dm-teamspeak', ['dm-codeshare']).directive('dmTeamspeak', ['Sockets', 'dmUser', '$window', 'codeShareService', '$state', 'dmSlidesaves', '$http', '$modal', '$rootScope',
        function (Sockets, dmUser, $window, codeShareService, $state, dmSlidesaves, $http, $modal, $rootScope) {
            return {
                restrict: 'E',
                templateUrl: '/static/dm-modules/dm-teamspeak/dm-teamspeak.html',
                link: function (scope) {

                    var modalAnnouncement;

                    scope.setCurrentWriter = codeShareService.setCurrentWriter;
                    scope.isUserAWriter = codeShareService.isUserAWriter;

                    scope.channelList = scope.clientId = scope.userId = scope.isTrainer = null;
                    scope.clientMassMoved = false;

                    var showUserWarning = function () {
                        $modal.open({
                            templateUrl: '/static/dm-modules/dm-teamspeak/modal-announcement.html',
                            size: 'sm',
                            backdrop: false
                        });
                    };

                    sliderPlugins.listen($rootScope, 'teamspeak.moveClientToChannelByName', function (channelName) {
                        Sockets.emit('teamspeak.moveToChannelByName', channelName, function (error) {
                            if (error) {
                                console.log(error);
                            }
                            openWorkspace(channelName);
                        });
                    });

                    function refreshUserData() {
                        dmUser.getCurrentUser().then(function (data) {
                            scope.clientId = data.result.teamspeak ? data.result.teamspeak.clientId : null;
                            scope.userId = data.result._id;
                            scope.isTrainer = !!_.find(data.result.acl, function (acl) {
                                return acl == 'trainer' || acl.search('admin:') != -1;
                            });
                        }, function (error) {
                            console.log(error);
                        });
                    }

                    refreshUserData();

                    scope.moveToChannel = function (channel) {
                        //jezeli uzytkownik jest w pokoju Team_1 po oswiezeniu strony i nie ma w adresie workspace
                        // czyli np link do samego kursu 'http://localhost:3000/#/space/5478f03cd86871a82bb44c31'
                        //to nie ma mozliwosci otworzenia workspace z edytorem
                        //dlatego na ta chwile umozliwilem aby po kliknieciu na nazwe kanału w którym aktualnie jestem i nie mam otwartego workspace
                        //otworzyc workspace z edytorem
                        if (scope.userChannel !== null && channel.cid === scope.userChannel.cid &&
                            getChannelName(channel.name) !== codeShareService.getCurrentWorkspace()) {
                            openWorkspace(channel.name);
                        }
                        else {
                            Sockets.emit('teamspeak.moveToChannel', channel.cid, function (error) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('You have been moved');
                                    openWorkspace(channel.name);
                                }
                            });
                        }
                    };

                    function getChannelName(channelName) {
                        return 'channel_' + channelName;
                    }

                    function openWorkspace(channelName) {
                        codeShareService.resetWorkspaceForNew(channelName);

                        $http.post('/api/base_slide/' + scope.event.baseSlide + '/' + getChannelName(channelName)).then(function (data) {
                            dmSlidesaves.allSaves(true); // ugly! update saves list, TODO ugly
                            $state.go('index.space.workspace', {
                                slide: data.data.slidesave,
                                channel: getChannelName(channelName)
                            });
                            scope.workspaceId = data.data.slidesave;
                        });
                    }

                    scope.moveAllClientsToDefaultChannel = function () {
                        Sockets.emit('teamspeak.moveAllClientsToDefaultChannel');
                    };

                    scope.restoreClientsChannels = function () {
                        Sockets.emit('teamspeak.restoreClientsChannels');
                    };

                    Sockets.on('teamspeak.channelList', function (channelList, clientMassMoved) {
                        scope.clientMassMoved = clientMassMoved;
                        //console.log('scope.clientId', scope.clientId, 'scope.userId', scope.userId, 'channelList', channelList);

                        scope.userChannel = getMyChannel(channelList);
                        scope.channelList = channelList;

                        ifCurrentWriterNotExistsInUserChannelResetCurrentWriter();
                        ifNoCurrentWriterInWorkspaceSetFirstLinkedClient();

                        if (scope.userChannel && scope.userChannel.name !== codeShareService.getCurrentWorkspace()) {
                            codeShareService.setCurrentWorkspace(scope.userChannel.name);
                            openWorkspace(scope.userChannel.name);
                        }

                        scope.$apply();
                    });

                    Sockets.on('teamspeak.showAnnouncement', function () {
                        modalAnnouncement = $modal.open({
                            templateUrl: '/static/dm-modules/dm-teamspeak/modal-announcement.html',
                            size: 'sm'
                        });
                    });

                    Sockets.on('teamspeak.hideAnnouncement', function () {
                        modalAnnouncement && modalAnnouncement.close();
                    });

                    Sockets.emit('teamspeak.init');

                    function ifCurrentWriterNotExistsInUserChannelResetCurrentWriter() {
                        var writerExistsInChannel = false;

                        if (!scope.userChannel) {
                            return;
                        }

                        if (codeShareService.isConnectedToWorkSpace() && codeShareService.isSetCurrentWriter()) {
                            _.each(scope.userChannel.clients, function (client) {
                                if (client.userId === codeShareService.getCurrentWriter().id && client.isLinked) {
                                    writerExistsInChannel = true;
                                }
                            });

                            //kiedy resetujemy pisarza:
                            // 1. jezeli pisarz rozlaczyl sie z teamspikiem
                            // 2. jezeli pisarz przeszedl do innego kanalu i nie oddał pisania komus innemu
                            if (!writerExistsInChannel) {
                                codeShareService.resetCurrentWriter();
                                console.log('resetCurrentWriter');
                            }
                        }
                    }

                    function ifNoCurrentWriterInWorkspaceSetFirstLinkedClient() {

                        if (!scope.userChannel) {
                            return;
                        }

                        if (codeShareService.isConnectedToWorkSpace() && !codeShareService.isSetCurrentWriter()) {
                            _.each(scope.channelList, function (channel) {
                                if (channel.cid === scope.userChannel.cid) {
                                    _.each(channel.clients, function (client) {
                                        if (client.isLinked) {
                                            console.log('set current writer', client.userId);
                                            codeShareService.setCurrentWriter(client.userId);
                                            return;
                                        }
                                    });
                                }
                            });
                        }
                    }

                    function getMyChannel (channelList) {
                        var userChannel = null;

                        _.each(channelList, function (channel) {
                            _.each(channel.clients, function (client) {
                                if (client.userId === scope.userId) {
                                    userChannel = channel;
                                }
                            });
                        });

                        return userChannel;
                    }
                }
            }
        }
    ]);

});
