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

    var user = socket.manager.handshaken[socket.id].user,
        linkedClient = null;

    /**
     * @TODO pobierać od razu ze statusem czy klient jest powiązany z userem
     */
    function getList() {
        Teamspeak.getList().then(function (channelsTree) {
            socket.emit('teamspeak.channelList', channelsTree);
        }).fail(function (error) {
            console.error(new Error('Teamspeak - ' + error.msg));
        });
    }

    socket.on('teamspeak.init', function () {

        // @TODO check if active user is connected with teamspeak client

        getList();

    });

    socket.on('teamspeak.linkClient', function (client, callback) {

        // TODO klientow przenosi sie za pomoca clid wiec trzeba zdecydowac co zapisujemy: clid czy database_id (persist)
        Users.linkUserWithTeamspeakClient(user, client.client_database_id).then(function () {
            linkedClient = client;
            callback();
        }).fail(function (error) {
            callback('Błąd' + error.msg);
        });

    });

    socket.on('teamspeak.moveToChannel', function (channel, callback) {

        if (linkedClient == null) {
            return callback('Tymczasowo musisz chociaż raz się powiązać');
        }

        Teamspeak.moveClients([linkedClient.clid], channel.cid).then(function () {
            getList();
        }).fail(function (error) {
            console.error(new Error('Teamspeak - ' + error.msg));
        });

    });
};
