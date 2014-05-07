var CommentModel = require('./comment');

exports.socketInit = function(log, socket) {

    var joinChat = function(data, res) {
        if (socket.room) {
            socket.leave(socket.room);
        }

        socket.room = data.presentation + '#' + data.slide;
        socket.join(socket.room);

        var query = CommentModel.find().where('presentation').equals(data.presentation).where('slide').equals(data.slide);

        query.exec(function(err, comments) {
            if (err) {
                console.error(err);
                //res([]);
                return;
            }
            res(comments);
        });
    };

    var sendChatMsg = function(data, res) {
        var d = new CommentModel(data);
        d.save(function(err, comment) {
            if (err) {
                console.error(err);
                return;
            }
            socket.broadcast.to(socket.room).emit('chat.msg.send', data);
        });
    };


    socket.on('chat.join', joinChat);
    socket.on('chat.msg.send', sendChatMsg);
};