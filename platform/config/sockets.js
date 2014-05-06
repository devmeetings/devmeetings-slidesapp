var log = function(socket) {
    return function() {
        var args = [].slice.call(arguments);
        args.unshift("[" + socket.id + "] ");
        console.log.apply(console, args);
    };
};

var ctrl = function(ctrlName) {
    return require('../app/controllers/' + ctrlName);
};

module.exports = function(io) {
    io.on('connection', function(socket) {
        var id = socket.id;
        var l = log(socket);

        l("New client connected");

        var comments = ctrl('comments');
        socket.on('chat.join', comments.joinChat(socket));
        socket.on('chat.msg.send', comments.sendChatMsg(socket));

    });
};