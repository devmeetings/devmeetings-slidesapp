var _ = require('underscore');

var trainers = [];

var log = function(socket) {
  return function() {
    var args = [].slice.call(arguments);
    args.unshift("["+socket.id+"] ");
    console.log.apply(console, args);
  };
};

var clients = {};

var sendClientsDataToTrainers = function() {
  trainers.forEach(function(socket) {
    socket.emit('clients', clients);
  });
};
var sendClientsDataLater = _.debounce(sendClientsDataToTrainers, 1000);

module.exports = function(io) {
  io.on('connection', function(socket) {
    var id = socket.id;
    var clientData = clients[id] = {
      microtasks: {}
    };

    var l = log(socket);
    l("New client connected");

    socket.on('name', function(name) {
      l("Setting name", name);
      clientData.name = name;
      sendClientsDataLater();
    });

    socket.on('currentSlide', function(slide, presentation) {
      l("Changing currentSlide", slide);
      clientData.slide = slide;
      clientData.presentation = presentation;
      sendClientsDataLater();
    });

    socket.on('microtasks', function(data){
      clientData.microtasks[data.slideId] = data.microtasks;
      sendClientsDataLater();
    });

    socket.on('trainer', function() {
      trainers.push(socket);
      socket.emit('clients', clients);
    });

    socket.on('solution', function(solutionId) {
      l("Trying to display solution", solutionId);
      if (trainers.indexOf(socket) === -1) {
        return;
      }
      l("Broadcasting solution", solutionId);
      socket.broadcast.emit('solution', solutionId);
    });

    socket.on('disconnect', function() {
      l("Disconnected");
      delete clients[id];
      var i = trainers.indexOf(socket);
      if (i > -1) {
        trainers.splice(i, 1);
      }
      sendClientsDataLater();
    });
  });
};