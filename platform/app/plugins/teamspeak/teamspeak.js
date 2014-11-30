var Teamspeak = require('../../services/teamspeak'),
    _ = require('lodash'),
    heartbeatInterval;

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

                // TODO jesli nie znajdzie to sprawdzanie po adresie ip i nicku
                socket = getUserSocketByClientDbId(sockets, client.client_database_id);
                if (socket) {
                    client.isLinked = true;
                    client.userData = socket.user;

                    if (socket.user.teamspeak.clientId != client.clid) {
                        updateData = {
                            clientId: client.clid,
                            clientDbId: client.client_database_id
                        };
                        socket.user.teamspeak.clientId = client.clid;
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

function startHeartbeat() {
    // heartbeat
    heartbeatInterval = setInterval(function () {
        Teamspeak.ping().then(function () {
            console.log("  [Teamspeak] Heartbeat");
        }).fail(function (error) {
            console.error(new Error('Teamspeak - ' + (error.msg || error)));
        });
    }, 30 * 1000);
}

function stopHeartbeat() {
    clearInterval(heartbeatInterval);
}

exports.init = function () {

    Teamspeak.init().then(function () {
        console.log("  [Teamspeak] Connection established");
        startHeartbeat();
    }, function () {
        throw new Error('Connetion error');
    });

};

exports.onSocket = function (log, socket, io) {

    var sendChannelList = function (clearCache) {
        Teamspeak.getList(clearCache).then(function (channelsTree) {
            linkClientsWithUsers(channelsTree, socket.manager.handshaken);
            socket.emit('teamspeak.channelList', channelsTree);
        }).fail(function (error) {
            console.error(new Error('Teamspeak - ' + (error.msg || error)));
        });
    };

    stopHeartbeat();

    // heartbeat and renew cache
    var refreshListInterval = setInterval(function () {
        sendChannelList(true);
    }, 3 * 1000);

    var init = function () {
        sendChannelList(true);
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
        }).fail(function (error) {
            console.error(new Error('Teamspeak - ' + (error.msg || error)));
        });

    };

    var onDisconnect = function () {
        if (Object.keys(socket.manager.handshaken).length == 1) {
            // last user disconects so we must maintain connection to teamspeak server forever
            startHeartbeat();
            clearInterval(refreshListInterval);
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
