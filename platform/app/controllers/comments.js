var CommentModel = require('../models/comment');


exports.joinChat = function (socket) {
    return function (data, res) {
        if (socket.room) {
            socket.leave(socket.room);
        }

        socket.room = data.presentation + '#' + data.slide;
        socket.join(socket.room);

        var query = CommentModel.find().where('presentation').equals(data.presentation).where('slide').equals(data.slide);
    
        query.exec(function (err, comments) {
            if (err){
                console.error(err);
                //res([]);
                return;
            }
            res(comments);
        });
    };
};

exports.sendChatMsg = function (socket) {
    return function (data, res) {
        var d = new CommentModel(data);
        d.save(function (err, comment) {
            if (err) {
                console.error(err);
                return;
            }
            socket.broadcast.to(socket.room).emit('sendChatMsg', data);
        });
    };
};


