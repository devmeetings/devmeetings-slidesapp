var TeamSpeakClient = require("node-teamspeak"),
    Q = require('q');

var SERVER_IP = "#####";
var SERVER_PORT = "#####";

var LOGIN = "l";
var PASSWORD = "p";

var cl = new TeamSpeakClient(SERVER_IP, SERVER_PORT);


function wrap(promise) {
    promise.thenSend = function(name, data) {
        return promise.then(send(name, data));
    };
    var then = promise.then;
    promise.then = function( /* args */ ) {
        return wrap(then.apply(promise, arguments));
    };
    return promise;
};

function send(name, data) {
    var promise = Q.ninvoke(cl, 'send', name, data);
    return wrap(promise);
}

send("login", {
    client_login_name: LOGIN,
    client_login_password: PASSWORD
}).thenSend("use", {
    sid: 1
}).thenSend("clientlist").then(function(response, rawResponse) {
    console.dir(response);
}).done();