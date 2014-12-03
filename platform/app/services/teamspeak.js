var Users = require('../services/users'),
    _ = require('lodash'),
    Q = require('q'),
    TeamSpeakClient = require("node-teamspeak"),
    config = require('../../config/config'),
    TsClient = null,
    channelListCache = null,
    //commandCounter = 0, // counter of how many commands were sent
    promise = {}; // @TODO create empty promise?

/**
 * @TODO zabezpieczenie przed banem - należy odliczac czas po wykonaniu zapytania, jesli minie czas okreslony w configu to zeruje licznik
 *       Jesli query user ma odpowiednie permissiony to moze pobrac limity na komendy z serverinstanceinfo
 */


function castArray(element) {
    return _.isArray(element) ? element : [element];
}

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

// TODO somehow handle connection error and reconnect it
function send(name, data) {
    var defer = Q.defer();

    //commandCounter++;
    //console.log('  [Teamspeak] Send: ' + name + ' [' + commandCounter + ']');

    // TODO handle throttle
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
    return clients.filter(function (client) {
        return client.cid == cid && client.client_type === 0;
    });
}

/**
 * @TODO move tree creation to front side
 *
 * @param {Array} channels
 * @param {Number} cid
 * @param {Array} clients
 * @returns {Array}
 */
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

function create(options) {
    var defer = Q.defer();

    promise.thenSend('channelcreate', options).then(function (results) {
        defer.resolve(results);
    }).fail(function (error) {
        defer.reject(error);
    });
    return defer.promise;
}

/**
 * Creates recursively channel tree structure
 * @param {Array} channelTree
 * @param {callback} callback
 */
function createChannels(channelsSource, cid) {
    var defer = Q.defer();

    channelsSource.structure.forEach(function (element) {
        element.options.cpid = cid;

        // pass global options to element
        _.assign(element.options, channelsSource.options || {});

        create(element.options).then(function (results) {
            if (element.children) {
                // inherit options
                var children = element.children.map(function (channel) {
                    _.assign(channel.options, channelsSource.options || {});
                    return channel;
                });

                children.forEach(function (node) {
                    createChannels(node, results.cid).then(function (results) {
                        return defer.resolve(results);
                    }).fail(function (error) {
                        return defer.reject(error);
                    });
                });
            }

            return defer.resolve(results);
        }).fail(function (error) {
            return defer.reject(error);
        });
    });

    return defer.promise;
}

/**
 * @param {Boolean} clearCache
 * @returns {Promise}
 */
function getChannelList(clearCache) {
    var defer = Q.defer();

    if (channelListCache && !clearCache) {
        defer.resolve(channelListCache);
    } else {
        promise.thenSend('channellist', ['flags']).then(function (results) {
            channelListCache = castArray(results);
            defer.resolve(channelListCache);
        }).fail(function (error) {
            defer.reject(error);
        });
    }

    return defer.promise;
}

/**
 * @returns {Promise}
 */
function getClientList() {
    var defer = Q.defer();

    promise.thenSend('clientlist').then(function (clients) {
        defer.resolve(castArray(clients));
    }).fail(function (error) {
        defer.reject(error);
    });

    return defer.promise;
}

/**
 * Move clients to specified channel
 * @param {Array} clients - Clients IDs
 * @param {Number} channelId - Target channel ID
 * @returns {Promise}
 */
function moveClients(clients, channelId) {
    var defer = Q.defer();

    promise.thenSend('clientmove', {clid: clients, cid: channelId}).then(function (results) {
        defer.resolve(castArray(results));
    }).fail(function (error) {
        defer.reject(error);
    });

    return defer.promise;
}

/**
 * @param {Number} channelId
 * @returns {Promise}
 */
function removeChannel(channelId) {
    var defer = Q.defer();

    promise.thenSend('channeldelete', {cid: channelId, force: 1}).then(function (results) {
        defer.resolve(results);
    }).fail(function (error) {
        defer.reject(error);
    });

    return defer.promise;
}

function init() {
    // new connection to serverquery
    TsClient = new TeamSpeakClient(config.teamspeak.host, config.teamspeak.port);

    promise = send("use", {
        sid: config.teamspeak.sid
    }).thenSend("login", {
        client_login_name: config.teamspeak.login,
        client_login_password: config.teamspeak.password
    }).fail(function (error) {
        console.error(new Error('Teamspeak - ' + error.msg));
    });

    return promise;
}

function disconnect() {
    var defer = Q.defer();

    if (!_.isEmpty(promise)) {
        promise.thenSend('quit').then(function (results) {
            defer.resolve(results);
        }).fail(function (error) {
            defer.reject(error);
        });
    }

    return defer.promise;
}


module.exports = {

    init: init,

    disconnect: disconnect,

    getChannelList: getChannelList,

    getClientList: getClientList,

    /**
     * Return tree with channels and clients
     * @param {Boolean} clearCache
     * @returns {Promise}
     */
    getList: function (clearCache) {
        var defer = Q.defer();

        getChannelList(clearCache).then(function (channels) {
            promise.thenSend('clientlist', ['voice', 'info', 'icon', 'groups', 'country']).then(function (clients) {
                try {
                    defer.resolve(makeTree(channels, 0, castArray(clients)));
                } catch (error) {
                    defer.reject(error);
                }
            }).fail(function (error) {
                defer.reject(error);
            });
        }).fail(function (error) {
            defer.reject(error);
        });

        return defer.promise;
    },

    moveClients: moveClients,

    /**
     * Connect active user with Teamspeak client
     * @param {User} user
     */
    setUserConnection: function (user) {

    },

    /**
     * Import channel structure
     * @param options
     * @returns {Promise}
     */
    importChannelTree: function (options) {
        var defer = Q.defer();

        createChannels(options, 0).then(function (results) {
            console.log(results);
            defer.resolve(results);
        }).fail(function (error) {
            defer.reject(error);
        });

        return defer.promise;
    },

    /**
     * Remove all channels (except default)
     * @returns {Promise}
     */
    clearChannels: function () {
        var defer = Q.defer();

        getChannelList(true).then(function (channels) {
            channels.forEach(function (channel) {
                if (channel.channel_flag_default) {
                    return defer.resolve();
                }
                removeChannel(channel.cid).then(function (results) {
                    console.log(results);
                    defer.resolve(results);
                }).fail(function (error) {
                    defer.reject(error);
                });
            });
        });
        return defer.promise;
    },

    saveTeamspeakData: function (userId, data) {
        var defer = Q.defer();
        Users.saveTeamspeakData(userId, data).then(function () {
            defer.resolve();
        }).fail(function (error) {
            defer.reject(error);
        });
        return defer.promise;
    },

    ping: function () {
        var defer = Q.defer();

        promise.thenSend('version').then(function () {
            defer.resolve();
        }).fail(function (error) {
            defer.reject(error);
        });

        return defer.promise;
    }


};

/*Teamspeak.getList().then(function (channelsTree) {
 console.log(channelsTree);
 }).fail(function (error) {
 console.error(new Error('Teamspeak - ' + error.msg));
 });

 Teamspeak.createChannel({channel_name: 'Test4 channel', cpid: 138654, channel_flag_permanent: 1}).then(function (result) {
 console.log(result);
 }).fail(function (error) {
 console.error(new Error('Teamspeak - ' + error.msg));
 });

 Teamspeak.removeChannel(138661).then(function (result) {
 console.log(result);
 }).fail(function (error) {
 console.error(new Error('Teamspeak - ' + error.msg));
 });

 Teamspeak.moveClients([92], 139177).then(function () {
 console.log('Moved');
 }).fail(function (error) {
 console.error(new Error('Teamspeak - ' + error.msg));
 });*/
