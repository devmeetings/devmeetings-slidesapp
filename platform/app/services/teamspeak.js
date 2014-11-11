var Users = require('../services/users'),
    _ = require('lodash'),
    Q = require('q'),
    TeamSpeakClient = require("node-teamspeak"),
    config = require('../../config/config'),
    TsClient = new TeamSpeakClient(config.teamspeak.host, config.teamspeak.port);

function wrap(promise) {
    promise.thenSend = function (name, data) {
        return promise.then(function () {
            return send(name, data);
        });
    };
    var then = promise.then;
    promise.then = function (/* args */) {
        return wrap(then.apply(promise, arguments));
    };
    return promise;
}

function send(name, data) {
    var defer = Q.defer();

    TsClient.send(name, data, function (err, response, raw) {
        if (err.id === '0' || err.msg === 'ok') {
            defer.resolve(response);
        } else {
            defer.reject(err);
        }
    });
    return wrap(defer.promise);
}

function getClients(cid, clients) {
    // when only 1 client is looged - serverquery user
    if (!_.isArray(clients)) {
        return [];
    }
    return clients.filter(function (client) {
        return client.cid == cid && client.client_type === 0;
    });
}

function makeTree(channels, cid, clients) {
    var tree = [];
    channels.forEach(function (channel) {
        if (channel.pid == cid && /spacer(.*?)]/.test(channel.channel_name) === false) {
            tree.push(
                {
                    cid: channel.cid,
                    pid: channel.pid,
                    name: channel.channel_name,
                    clients: getClients(channel.cid, clients),
                    children: makeTree(channels, channel.cid, clients)
                }
            );
        }
    });
    return tree;
}

var promise = send("use", {
    sid: config.teamspeak.sid
}).thenSend("login", {
    client_login_name: config.teamspeak.login,
    client_login_password: config.teamspeak.password
});

module.exports = {
    /**
     * Return tree with channels and clients
     */
    getList: function () {
        var result = Q.defer(),
            channels;
        promise.thenSend('channellist', ['limits', 'flags', 'voice', 'icon']).then(function (results) {
            channels = results;
        }).thenSend('clientlist', ['away', 'voice', 'info', 'icon', 'groups', 'country']).then(function (clients) {
            try {
                result.resolve(makeTree(channels, 0, clients));
            } catch (error) {
                result.reject(new Error(error));
            }
        });
        return result.promise;
    },

    /**
     * Move client to specified channel
     * @param {Number} clid - Client ID
     * @param {Number} cid - Channel ID
     */
    moveClient: function (clid, cid) {

    },

    /**
     * Connect active user with Teamspeak client
     * @param {User} user
     */
    setUserConnection: function (user) {

    }
};
