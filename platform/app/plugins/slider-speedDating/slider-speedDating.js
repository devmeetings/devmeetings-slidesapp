var SpeedDating = require('./SpeedDating');

exports.onSocket = function (log, socket) {
    var getConnections = function(data){

        SpeedDating.find()
            .where('deck').equals(data.deck)
            .where('slide').equals(data.slide)
            //date today now
            .exec(function (err, connections) {
                if (err) {
                    console.error(err);
                    //res([]);
                    return;
                }
                else {
                    socket.emit('speedDating.connections', connections);
                    socket.broadcast.emit('speedDating.connections', connections);
                }
            }
        );
    };
    socket.on('speedDating.connected', function (data) {
        data.username = socket.handshake.user.name;
        var query = SpeedDating.findOne()
            .where('deck').equals(data.deck)
            .where('slide').equals(data.slide)
            .where('username').equals(data.username);

        query.exec(function (err, connection) {
            if (err) {
                console.error(err);
                //res([]);
                return;
            } else if (connection) {
                connection.updated = Date.now();
                connection.save(getConnections.bind(null,data));
            } else {
                var newConnection = new SpeedDating(data);
                newConnection.save(getConnections.bind(null,data));
            }
        });
    });
    socket.on('speedDating.call', function (data, callback) {
        //find user, update calls
        data.user = socket.handshake.user.name;
        var sd = new SpeedDating(data);
        sd.save(callback);
    });
    socket.on('speedDating.destroy', function (data, callback) {
        //find user, delete it
        data.user = socket.handshake.user.name;
        var sd = new SpeedDating(data);
        sd.save(callback);
    });

};