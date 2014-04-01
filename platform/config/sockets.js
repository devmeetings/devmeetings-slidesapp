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
  });
};