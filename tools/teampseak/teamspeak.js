var TeamSpeakClient = require("node-teamspeak"),
    Q = require('q'),
    _ = require('lodash');

var SERVER_HOST = "applejack.todr.me",
    SERVER_PORT = 10011,
    VIRTUAL_SID = 1,
    LOGIN = "serveradmin",
    PASSWORD = "dkT99L9i",
    TsClient = new TeamSpeakClient(SERVER_HOST, SERVER_PORT),
    commandCounter = 0;

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

    commandCounter++;
    console.log('Send: ' + name + ' [' + commandCounter + ']');

    // Tutaj należy przerywać po 10ciu poleceniach bo bedzie Ban na 10 minut!

    TsClient.send(name, data, function (err, response, raw) {
        if (err.id === '0' || err.msg === 'ok') {
            defer.resolve(response);
        } else {
            defer.reject(err);
        }
    });

    return wrap(defer.promise);
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

function castArray(element) {
    return _.isArray(element) ? element : [element];
}

function getChannelList() {
    var defer = Q.defer();

    promise.thenSend('channellist', ['flags']).then(function (results) {
        defer.resolve(castArray(results));
    }).fail(function (error) {
        defer.reject(error);
    });

    return defer.promise;
}

var promise = send("use", {
    sid: VIRTUAL_SID
}).thenSend("login", {
    client_login_name: LOGIN,
    client_login_password: PASSWORD
}).fail(function (error) {
    console.error(new Error('Teamspeak - ' + error.msg));
});

module.exports = {

    /**
     * Import channel structure
     * @param options
     * @returns {Promise}
     */
    importChannelTree: function (options) {
        var defer = Q.defer();

        createChannels(options, 0).then(function (results) {
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

        getChannelList().then(function (channels) {
            channels.forEach(function (channel) {
                if (channel.channel_flag_default) {
                    return defer.resolve();
                }
                removeChannel(channel.cid).then(function(results){
                    defer.resolve(results);
                }).fail(function (error) {
                    defer.reject(error);
                });
            })
        });
        return defer.promise;
    }
};
