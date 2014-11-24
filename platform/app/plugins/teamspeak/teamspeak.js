var Teamspeak = require('../../services/teamspeak'),
    Users = require('../../services/users');

exports.init = function () {

    Teamspeak.init().then(function () {
        console.log("  [Teamspeak] Connection established");
    }, function () {
        throw new Error('Connetion error');
    });

};

exports.onSocket = function (log, socket, io) {

    socket.on('teamspeak.init', function () {

        // @TODO check if active user is connected with teamspeak client

        Teamspeak.getList().then(function (channelsTree) {
            socket.emit('teamspeak.channelList', channelsTree);
        }).fail(function (error) {
            console.error(new Error('Teamspeak - ' + error.msg));
        });

    });

    socket.on('teamspeak.linkClient', function (client, callback) {

        // TODO klientow przenosi sie za pomoca clid wiec trzeba zdecydowac co zapisujemy: clid czy database_id (persist)
        Users.linkUserWithTeamspeakClient(socket.manager.handshaken[socket.id].user, client.client_database_id).then(function () {
            callback();
        }).fail(function (error) {
            callback('Błąd' + error.msg);
        });

    });
};
