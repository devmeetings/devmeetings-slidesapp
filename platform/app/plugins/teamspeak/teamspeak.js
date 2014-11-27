var Teamspeak = require('../../services/teamspeak'),
    Users = require('../../services/users'),
    _ = require('lodash');

function getUserSocketByClientDbId(sockets, id) {
    return _.find(sockets, function (socket) {
        return socket.user.teamspeak.clientDbId === id;
    });
}

function linkClientsWithUsers(channelsTree, sockets) {
    var socket;

    channelsTree.forEach(function (channel) {
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
                    // link with actual clid
                    if (socket.user.teamspeak.clientId != client.clid) {

                        Users.linkUserWithTeamspeakClient(socket.user, client.clid, client.client_database_id).then(function () {
                            socket.user.teamspeak.clientId = client.clid;
                        }).fail(function (error) {
                            console.error(new Error('Teamspeak - ' + (error.msg || error)));
                        });
                    }

                    client.isLinked = true;
                    client.userData = socket.user;
                }
            });
        }
    });
}

exports.init = function () {

    Teamspeak.init().then(function () {
        console.log("  [Teamspeak] Connection established");
    }, function () {
        throw new Error('Connetion error');
    });

};

exports.onSocket = function (log, socket, io) {

    function sendChannelList(clearCache) {
        Teamspeak.getList(clearCache).then(function (channelsTree) {
            linkClientsWithUsers(channelsTree, socket.manager.handshaken);
            socket.emit('teamspeak.channelList', channelsTree);
        }).fail(function (error) {
            console.error(new Error('Teamspeak - ' + (error.msg || error)));
        });
    }

    socket.on('teamspeak.init', function () {
        sendChannelList(true);
    });

    // heartbeat
    setInterval(function(){
        sendChannelList(true);
    }, 10 * 1000); // 10 seconds

    socket.on('teamspeak.linkClient', function (client, callback) {

        // TODO klientow przenosi sie za pomoca clid wiec trzeba zdecydowac co zapisujemy: clid czy database_id (persistent)
        Users.linkUserWithTeamspeakClient(socket.handshake.user, client.clid, client.client_database_id).then(function (data) {
            // update client in handshake
            socket.handshake.user.teamspeak = {
                clientId: client.clid,
                clientDbId: client.client_database_id
            };

            // trigger channel list refresh
            sendChannelList();

            callback();
        }).fail(function (error) {
            callback('Error ' + error.msg);
        });

    });

    socket.on('teamspeak.unlinkClient', function (callback) {

        Users.linkUserWithTeamspeakClient(socket.handshake.user, null, null).then(function () {
            // update client in handshake
            socket.handshake.user.teamspeak = null;

            // trigger channel list refresh
            sendChannelList();

            callback();
        }).fail(function (error) {
            callback('Error ' + error.msg);
        });

    });

    socket.on('teamspeak.moveToChannel', function (channelId, callback) {

        if (!socket.handshake.user.teamspeak.clientId) {
            return callback('You are not linked with teamspeak client');
        }

        Teamspeak.moveClients([socket.handshake.user.teamspeak.clientId], channelId).then(function () {
            sendChannelList();
        }).fail(function (error) {
            console.error(new Error('Teamspeak - ' + (error.msg || error)));
        });

    });
};
