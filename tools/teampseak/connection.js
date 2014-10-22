var TeamSpeakClient = require("node-teamspeak"),
    Q = require('q'),
    _ = require('lodash');

var SERVER_IP = "62.67.42.152";
var SERVER_PORT = "9100";
var VIRTUAL_SID = 3699;

var LOGIN = "devmeetings_bot";
var PASSWORD = "3CV5bonA";

var cl = new TeamSpeakClient(SERVER_IP, SERVER_PORT);

function wrap(promise) {
    promise.thenSend = function(name, data) {
        return promise.then(function() {
            return send(name, data)
        });
    };
    var then = promise.then;
    promise.then = function( /* args */ ) {
        return wrap(then.apply(promise, arguments));
    };
    return promise;
}


function send(name, data) {
    var defer = Q.defer();

    cl.send(name, data, function(err, response, raw) {
        if (err.id === '0' || err.msg === 'ok') {
            defer.resolve(response);
        } else {
            defer.reject(err);
        }
    });
    return wrap(defer.promise);
}

function findClientsByName(clients, nameReg) {
    return clients.filter(function(c) {
        return c.client_nickname.search(nameReg) !== -1;
    });
}

function findChannelByName(channels, nameReg) {
    return channels.filter(function(c) {
        return c.channel_name.search(nameReg) !== -1;
    })[0];
}


module.exports = {
    send: send,
    findClientsByName: findClientsByName,
    findChannelByName: findChannelByName,
    server: send("use", {
        sid: VIRTUAL_SID
    }).thenSend("login", {
        client_login_name: LOGIN,
        client_login_password: PASSWORD
    })
};