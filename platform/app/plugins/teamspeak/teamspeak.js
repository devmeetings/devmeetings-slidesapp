var Ts = require('../../services/teamspeak');

exports.init = function () {

    Ts.init().then(function () {
        console.log("  [Teamspeak] Connection established");
    }, function () {
        throw new Error('Connetion error');
    });

    /*Ts.getList().then(function (channelsTree) {
        console.log(channelsTree);
    }).fail(function (error) {
        console.error(new Error('Teamspeak - ' + error.msg));
    });

    Ts.createChannel({channel_name: 'Test4 channel', cpid: 138654, channel_flag_permanent: 1}).then(function (result) {
        console.log(result);
    }).fail(function (error) {
        console.error(new Error('Teamspeak - ' + error.msg));
    });

    Ts.removeChannel(138661).then(function (result) {
        console.log(result);
    }).fail(function (error) {
        console.error(new Error('Teamspeak - ' + error.msg));
    });

    Ts.moveClients([92], 139177).then(function () {
        console.log('Moved');
    }).fail(function (error) {
        console.error(new Error('Teamspeak - ' + error.msg));
    });*/
};

exports.onSocket = function (log, socket, io) {

    socket.on('teamspeak.init', function () {

        // @TODO check if active user is connected with teamspeak client

        Ts.getList().then(function (channelsTree) {
            socket.emit('teamspeak.channelList', channelsTree);
        }).fail(function (error) {
            console.error(new Error('Teamspeak - ' + error.msg));
        });

    });
};
