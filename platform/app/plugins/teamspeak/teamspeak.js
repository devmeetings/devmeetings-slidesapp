var Teamspeak = require('../../services/teamspeak'),
    _ = require('lodash'),
    isConnected = false,
    maxNickNameLength = 15;

function getUserSocketByname(sockets, name) {
    return _.find(sockets, function (socket) {
        return socket.user.name == name;
    });
}

function updateUserData(userId, data, callback) {
    Teamspeak.saveTeamspeakData(userId, data).then(function () {
        callback();
    }).fail(function (error) {
        callback(error);
    });
}

function truncate(string, maxLength){
    if (string.length > maxLength) {
        return string.substring(0, maxLength - 3) + '...';
    }
    return string;
}

/**
 * TODO - need refactoring
 * @param channelsTree
 * @param sockets
 */
function linkClientsWithUsers(channelsTree, sockets) {
    var socket,
        updateData;

    channelsTree.forEach(function (channel) {
        updateData = {};

        // recursion
        if (channel.children) {
            linkClientsWithUsers(channel.children, sockets);
        }

        if (channel.clients) {
            channel.clients.forEach(function (client) {
                client.isLinked = false;
                client.nickShort = truncate(client.client_nickname, maxNickNameLength);
                client.nickTitle = client.client_nickname; // TODO unnecessary -> remove
                client.isTalking = !!client.client_flag_talking;

                socket = getUserSocketByname(sockets, client.client_nickname);
                if (socket) {
                    if (!updateData.clientId || updateData.clientId != client.clid) {
                        updateData.clientId = client.clid;
                        socket.user.teamspeak.clientId = client.clid;
                    }

                    client.isLinked = true;
                    client.userId = socket.user._id;

                    // if client was moved by trainer to forcesChannel and is in other channel we move him to forcedChannel
                    if (socket.user.teamspeak.forcedChannel && socket.user.teamspeak.forcedChannel != client.cid) {
                        Teamspeak.moveClients([client.clid], socket.user.teamspeak.forcedChannel).fail(function (error) {
                            console.error(new Error('Teamspeak - ' + (error.msg || error)));
                        });
                        return;
                    }
                    if (!socket.user.teamspeak.forcedChannel && socket.user.teamspeak.lastChannel != client.cid) {
                        updateData.lastChannel = client.cid;
                        socket.user.teamspeak.lastChannel = client.cid;
                    }

                    if (!_.isEmpty(updateData)) {
                        updateUserData(socket.user._id.toString(), updateData, function (error) {
                            if (error) {
                                return console.error(new Error('Teamspeak - ' + (error.msg || error)));
                            }
                        });
                    }
                }


            });
        }
    });
}

exports.onSocket = function (log, socket, io) {

    var refreshListInterval;

    var sendChannelList = function (clearCache) {
        Teamspeak.getList(clearCache).then(function (channelsTree) {
            linkClientsWithUsers(channelsTree, socket.manager.handshaken);
            // broadcast channellist
            //io.emit('teamspeak.channelList', channelsTree); // it's not working
            socket.broadcast.emit('teamspeak.channelList', channelsTree);
            socket.emit('teamspeak.channelList', channelsTree);
        }).fail(function(error){
            console.error(new Error('Teamspeak - ' + (error.msg || error)));
        });
    };

    var init = function () {

        if (isConnected) {
            return sendChannelList(true);
        }

        Teamspeak.init().then(function () {
            isConnected = true;
            console.log("  [Teamspeak] Connection established");

            // heartbeat
            /*refreshListInterval = setInterval(function () {
                sendChannelList();
            }, 3 * 1000);*/

            sendChannelList(true);
        }).fail(function(error){
            console.error(new Error('Teamspeak - ' + (error.msg || error)));
        });
    };

    var moveToChannel = function (channelId, callback) {

        if (!socket.handshake.user.teamspeak.clientId) {
            return callback('You are not linked with teamspeak client');
        }

        Teamspeak.moveClients([socket.handshake.user.teamspeak.clientId], channelId).then(function () {
            updateUserData(socket.handshake.user._id.toString(), {lastChannel: channelId}, function (error) {
                if (error) {
                    return callback(error);
                }
            });
            sendChannelList();
            callback();
        }).fail(function (error) {
            console.error(new Error('Teamspeak - ' + (error.msg || error)));
        });

    };

    var onDisconnect = function () {
        if (Object.keys(socket.manager.handshaken).length == 1) {
            // last user is disconnecting so we must disconnect
            Teamspeak.disconnect().then(function(){
                clearInterval(refreshListInterval);
                isConnected = false;
                console.log("  [Teamspeak] Disconected");
            });
        }
    };

    var moveAllClientsToChannel = function (channelId) {
        Teamspeak.getClientList().then(function (clientList) {
            var clients = [];

            for (var handshake in socket.manager.handshaken) {
                if (socket.manager.handshaken[handshake].user.teamspeak.clientId) {
                    clients.push(socket.manager.handshaken[handshake].user.teamspeak.clientId);
                }
            }

            if (_.isEmpty(clients)) {
                return;
            }

            Teamspeak.moveClients(clients, channelId).then(function () {
                for (var handshake in socket.manager.handshaken) {
                    socket.manager.handshaken[handshake].user.teamspeak.forcedChannel = channelId;
                }
                sendChannelList();
            }).fail(function (error) {
                console.error(new Error('Teamspeak - ' + (error.msg || error)));
            });
        }).fail(function (error) {
            console.error(new Error('Teamspeak - ' + (error.msg || error)));
        });
    };

    var moveClientToLastChannel = function(clientId, channelId) {
        Teamspeak.moveClients([clientId], channelId).then(function () {
        }).fail(function (error) {
            console.error(new Error('Teamspeak - ' + (error.msg || error)));
        });
    };

    var restoreClientsChannels = function () {
        var teamspeak;

        for (var handshake in socket.manager.handshaken) {
            teamspeak = socket.manager.handshaken[handshake].user.teamspeak;
            if (teamspeak.clientId && teamspeak.lastChannel) {
                moveClientToLastChannel(teamspeak.clientId, teamspeak.lastChannel);
                teamspeak.forcedChannel = null;
            }
        }
    };

    socket.on('teamspeak.init', init);
    socket.on('teamspeak.moveToChannel', moveToChannel);
    socket.on('teamspeak.moveAllClientsToChannel', moveAllClientsToChannel);
    socket.on('teamspeak.restoreClientsChannels', restoreClientsChannels);
    socket.on('disconnect', onDisconnect);
};
