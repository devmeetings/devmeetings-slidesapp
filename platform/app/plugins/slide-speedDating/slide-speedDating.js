var SpeedDating = require('./SpeedDating'),
    robin = require('roundrobin');

exports.onSocket = function(log, socket) {
    var getConnections = function(data, broadcast, callback) {
        var today = new Date();
        today.setHours(0, 0, 0);
        SpeedDating.find({
            deck: data.deck,
            slide: data.slide,
            updated: {
                $gte: today
            }
        }, 'username', function(err, connections) {
            if (err) {
                console.error(err);
                //res([]);
                return;
            } else if (broadcast) {
                socket.emit('speedDating.connections', connections);
                socket.broadcast.emit('speedDating.connections', connections);
            } else if (callback) {
                callback(connections);
            }
        });
    };
    socket.on('speedDating.connected', function(data) {
        data.username = socket.handshake.user.name;
        var query = SpeedDating.findOne()
            .where('deck').equals(data.deck)
            .where('slide').equals(data.slide)
            .where('username').equals(data.username);

        query.exec(function(err, connection) {
            if (err) {
                console.error(err);
                //res([]);
                return;
            } else if (connection) {
                connection.updated = Date.now();
                connection.save(getConnections.bind(null, data, true));
            } else {
                var newConnection = new SpeedDating(data);
                newConnection.save(getConnections.bind(null, data, true));
            }
        });
    });
    var queueTable = [];
    socket.on('speedDating.countQueues', function(data) {
        getConnections(data, false, function(connections) {
            if (connections) {

                var qtCon = connections.map(function(el) {
                    return el.username;
                });
                queueTable = robin(qtCon.length, qtCon);
            }
            socket.emit('speedDating.roundRobin', queueTable);
            socket.broadcast.emit('speedDating.roundRobin', queueTable);
        });
    });
    socket.on('speedDating.startDating', function() {
        socket.emit('speedDating.startDating');
        socket.broadcast.emit('speedDating.startDating');
    });
    socket.on('speedDating.finish', function() {
        socket.emit('speedDating.finish');
        socket.broadcast.emit('speedDating.finish');
    });
    socket.on('speedDating.nextRound', function(data) {
        if (data.round !== undefined && queueTable[data.round]) {
            var myQueue = {};
            queueTable[data.round].forEach(function(el) {
                if (el[0] === socket.handshake.user.name) {
                    myQueue = {
                        type: 'call',
                        user: el[1]
                    };
                } else if (el[1] === socket.handshake.user.name) {
                    myQueue = {
                        type: 'answer',
                        user: el[0]
                    };
                }
            });
            socket.emit('speedDating.startRound', myQueue);
        }
    });
    socket.on('speedDating.destroy', function(data, callback) {
        //find user, delete it
        data.user = socket.handshake.user.name;
        var sd = new SpeedDating(data);
        sd.save(callback);
    });

};