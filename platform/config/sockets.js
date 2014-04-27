var log = function(socket) {
    return function() {
        var args = [].slice.call(arguments);
        args.unshift("[" + socket.id + "] ");
        console.log.apply(console, args);
    };
};


module.exports = function(io) {
  io.on('connection', function(socket){
     var id = socket.id;
     var l = log(socket);

     l("New client connected");

     socket.on('joinChat', function(newroom) {
        if (socket.room) {
            socket.leave(socket.room);
        }
        socket.room = newroom;
        socket.join(newroom);
        l(newroom);
     });

     socket.on('sendChat', function (data) {
        socket.broadcast.to(socket.room).emit('sendChat', data); 
     });


     

  });
};
