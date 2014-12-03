var Teamspeak = require('../../services/teamspeak'),
    _ = require('lodash'),
    isConnected = false;

function getUserSocketByClientDbId(sockets, id) {
    return _.find(sockets, function (socket) {
        return socket.user.teamspeak.clientDbId === id;
    });
}

function updateUserData(userId, data, callback) {
    Teamspeak.saveTeamspeakData(userId, data).then(function () {
        callback();
    }).fail(function (error) {
        callback(error);
    });
}

function truncate(string){
    if (string.length > 11)
        return string.substring(0,8)+'...';
    else
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
            channel.clients.forEach(function (client, index) {
                client.isLinked = false;
                client.nickShort = truncate(client.client_nickname);
                client.nickTitle = client.client_nickname;

                // TODO jesli nie znajdzie to sprawdzanie po adresie ip i nicku
                socket = getUserSocketByClientDbId(sockets, client.client_database_id);
                if (socket) {
                    client.isLinked = true;
                    client.userId = socket.user._id;

                    if (socket.user.teamspeak.clientId != client.clid) {
                        updateData = {
                            clientId: client.clid,
                            clientDbId: client.client_database_id
                        };
                        socket.user.teamspeak.clientId = client.clid;
                        client.nickTitle += ' (You)';
                    }

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
            socket.emit('teamspeak.channelList', channelsTree);
        }).fail(function (error) {
            console.error(new Error('Teamspeak - ' + (error.msg || error)));
        });
    };

    var init = function () {
        if (!isConnected) {

            Teamspeak.init().then(function () {
                console.log("  [Teamspeak] Connection established");

                // heartbeat and renew cache
                refreshListInterval = setInterval(function () {
                    sendChannelList(true);
                }, 3 * 1000);

                sendChannelList(true);
                isConnected = true;
            }, function () {
                throw new Error('Connetion error');
            });
        } else {
            sendChannelList(true);
        }
    };

    var linkClient = function (client, callback) {
        var teamspeakData = {clientId: client.clid, clientDbId: client.client_database_id};

        updateUserData(socket.handshake.user._id.toString(), teamspeakData, function (error) {
            if (error) {
                return callback(error);
            }

            // update client in handshake
            socket.handshake.user.teamspeak = {
                clientId: client.clid,
                clientDbId: client.client_database_id
            };

            // trigger channel list refresh
            sendChannelList();

            callback();
        });
    };

    var unlinkClient = function (callback) {

        updateUserData(socket.handshake.user._id.toString(), null, function (error) {
            if (error) {
                return callback(error);
            }

            // update client in handshake
            socket.handshake.user.teamspeak = null;

            // trigger channel list refresh
            sendChannelList();

            callback();
        });
    };

    var moveToChannel = function (channelId, callback) {

        if (!socket.handshake.user.teamspeak.clientId) {
            return callback('You are not linked with teamspeak client');
        }

        Teamspeak.moveClients([socket.handshake.user.teamspeak.clientId], channelId).then(function () {
            updateUserData(socket.handshake.user._id.toString(), {lastChannel: channelId});
            sendChannelList();
            callback();
        }).fail(function (error) {
            console.error(new Error('Teamspeak - ' + (error.msg || error)));
        });

    };

    var onDisconnect = function () {
        if (Object.keys(socket.manager.handshaken).length == 1) {
            // last user is disconnecting so we must disconnect
            clearInterval(refreshListInterval);
            Teamspeak.disconnect();
            isConnected = false;
            console.log("  [Teamspeak] Disconected");
        }
    };

    var moveAllClientsToChannel = function (channelId) {
        Teamspeak.getClientList().then(function (clientList) {
            var clients = [];
            for (var i in clientList) {
                if (clientList[i].client_type === 0 && clientList[i].cid != channelId) {
                    clients.push(clientList[i].clid);
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

    var moveClientToLastChannel = function(teamspeak) {
        Teamspeak.moveClients([teamspeak.clientId], teamspeak.lastChannel).then(function () {
        }).fail(function (error) {
            console.error(new Error('Teamspeak - ' + (error.msg || error)));
        });
    };

    var restoreClientsChannels = function () {
        for (var handshake in socket.manager.handshaken) {
            moveClientToLastChannel(socket.manager.handshaken[handshake].user.teamspeak);
            socket.manager.handshaken[handshake].user.teamspeak.forcedChannel = null;
        }
    };

    socket.on('teamspeak.init', init);
    socket.on('teamspeak.linkClient', linkClient);
    socket.on('teamspeak.unlinkClient', unlinkClient);
    socket.on('teamspeak.moveToChannel', moveToChannel);
    socket.on('teamspeak.moveAllClientsToChannel', moveAllClientsToChannel);
    socket.on('teamspeak.restoreClientsChannels', restoreClientsChannels);
    socket.on('disconnect', onDisconnect);
};
